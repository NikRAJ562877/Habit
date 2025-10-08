import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        records: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 records
        }
      }
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Get habit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, category, frequency, color, icon, isActive } = await req.json()

    const habit = await prisma.habit.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(frequency && { frequency }),
        ...(color && { color }),
        ...(icon && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    })

    if (habit.count === 0) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Habit updated successfully' })
  } catch (error) {
    console.error('Update habit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete by setting isActive to false
    const habit = await prisma.habit.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        isActive: false
      }
    })

    if (habit.count === 0) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Habit deleted successfully' })
  } catch (error) {
    console.error('Delete habit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
