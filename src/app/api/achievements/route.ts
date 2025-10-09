import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type AchievementProgressClient = {
  findMany: (args: unknown) => Promise<any[]>
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const p = prisma as unknown as { achievementProgress: AchievementProgressClient }

    const progress = await p.achievementProgress.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlocked: 'desc' }
    } as unknown)

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}