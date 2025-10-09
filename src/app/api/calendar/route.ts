import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type ApiDay = {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  habits: Array<{
    id: string
    name: string
    completed: boolean
    color: string
    icon: string
  }>
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1)
}

function endOfMonth(year: number, month: number) {
  return new Date(year, month, 0, 23, 59, 59, 999)
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const year = parseInt(url.searchParams.get('year') || '') || new Date().getFullYear()
    const month = parseInt(url.searchParams.get('month') || '') || (new Date().getMonth() + 1)

    const start = startOfMonth(year, month)
    const end = endOfMonth(year, month)

    // Fetch user's habits and records in range
    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id, isActive: true },
      include: {
        records: {
          where: { date: { gte: start, lte: end } },
        }
      }
    })

    // Build days for calendar (Sunday start)
    const firstDayOfMonth = new Date(year, month - 1, 1)
    const startDayOffset = firstDayOfMonth.getDay() // 0-6

    const daysInMonth = new Date(year, month, 0).getDate()

    const totalCells = Math.ceil((startDayOffset + daysInMonth) / 7) * 7

    const days: ApiDay[] = []

    for (let i = 0; i < totalCells; i++) {
      const dayIndex = i - startDayOffset + 1
      const date = new Date(year, month - 1, dayIndex)
      const isCurrentMonth = dayIndex >= 1 && dayIndex <= daysInMonth
      const isToday = new Date().toDateString() === date.toDateString()

      const habitsForDay = isCurrentMonth
        ? habits.map(h => ({
            id: h.id,
            name: h.name,
            completed: h.records.some((r) => new Date(r.date).toDateString() === date.toDateString()),
            color: h.color,
            icon: h.icon,
          }))
        : []

      days.push({ date: date.toISOString(), isCurrentMonth, isToday, habits: habitsForDay })
    }

    return NextResponse.json({ year, month, days })
  } catch (error) {
    console.error('Get calendar error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}