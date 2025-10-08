import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateStreak } from '@/lib/utils'
import type { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
          },
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Add computed fields
    const habitsWithStats = habits.map(habit => ({
      ...habit,
      currentStreak: calculateStreak(habit.records),
      completionRate: habit.records.length > 0 
        ? (habit.records.filter(r => r.completed).length / habit.records.length) * 100 
        : 0,
      totalCompleted: habit.records.filter(r => r.completed).length,
    }))

    return NextResponse.json(habitsWithStats)
  } catch (error) {
    console.error('Get habits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, category, frequency, color, icon } = await req.json()

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    const validFrequencies = ['DAILY', 'WEEKLY', 'MONTHLY'] as const
    const freq = validFrequencies.includes(frequency) ? frequency : 'DAILY'

    const habit = await prisma.habit.create({
      data: {
        name,
        description: description || '',
        category,
        frequency: freq,
        color: color || '#3B82F6',
        icon: icon || '💪',
        user: { connect: { id: session.user.id } }
      } as Prisma.HabitCreateInput
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Create habit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
