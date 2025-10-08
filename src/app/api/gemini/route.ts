import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateHabitInsights, generateHabitSuggestions } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = await req.json()

    if (type === 'insights') {
      // Get user's habit data for analysis
      const habits = await prisma.habit.findMany({
        where: { 
          userId: session.user.id,
          isActive: true 
        },
        include: {
          records: {
            where: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          }
        }
      })

      if (habits.length === 0) {
        return NextResponse.json({ 
          insights: "Welcome to your habit tracking journey! Start by creating your first habit and track it daily to build momentum. I'll provide personalized insights as you build your routine." 
        })
      }

      const insights = await generateHabitInsights(habits)
      return NextResponse.json({ insights })
    }

    if (type === 'suggestions') {
      const { goals } = data || {}
      const suggestions = await generateHabitSuggestions(goals || "improve overall wellness and productivity")
      return NextResponse.json({ suggestions })
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
