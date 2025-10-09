import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@habitai.com' },
    update: {},
    create: {
      email: 'test@habitai.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  console.log('👤 Created user:', testUser.email)

  // Create sample habits
  const sampleHabits = [
    {
      name: 'Morning Exercise',
      description: '30 minutes of physical activity',
      category: 'Health',
      frequency: 'DAILY' as const,
      color: '#10B981',
      icon: '🏃‍♂️',
      targetDays: '[]',
      userId: testUser.id,
    },
    {
      name: 'Read for 20 minutes',
      description: 'Daily reading habit',
      category: 'Learning',
      frequency: 'DAILY' as const,
      color: '#3B82F6',
      icon: '📚',
      targetDays: '[]',
      userId: testUser.id,
    },
    {
      name: 'Drink Water',
      description: '8 glasses of water daily',
      category: 'Health',
      frequency: 'DAILY' as const,
      color: '#06B6D4',
      icon: '💧',
      targetDays: '[]',
      userId: testUser.id,
    },
  ]

  const createdHabits = await Promise.all(
    sampleHabits.map((habit) =>
      prisma.habit.create({ data: habit })
    )
  )

  console.log('🎯 Created habits:', createdHabits.length)

  // Create some sample records
  const today = new Date()
  const records: Prisma.HabitRecordCreateInput[] = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    for (const habit of createdHabits) {
      const completed = Math.random() > 0.3
      
      records.push({
        date: date,
        completed: completed,
        notes: completed ? 'Done!' : undefined,
        habit: { connect: { id: habit.id } },
        user: { connect: { id: testUser.id } },
      })
    }
  }

  await Promise.all(
    records.map((record) =>
      prisma.habitRecord.create({ data: record })
    )
  )

  console.log('📊 Created habit records:', records.length)

  // Achievements templates
  const achievements = [
    {
      key: 'streak_7',
      title: '7-Day Streak',
      description: 'Complete any habit 7 days in a row',
      criteriaType: 'STREAK',
      criteriaValue: 7,
      icon: '🔥',
      color: '#FB923C',
    },
    {
      key: 'streak_14',
      title: '14-Day Streak',
      description: 'Complete any habit 14 days in a row',
      criteriaType: 'STREAK',
      criteriaValue: 14,
      icon: '⚡',
      color: '#F97316',
    },
    {
      key: 'complete_10',
      title: '10 Completions',
      description: 'Complete habits 10 times in total',
      criteriaType: 'TOTAL_COMPLETIONS',
      criteriaValue: 10,
      icon: '🏅',
      color: '#F59E0B',
    },
    {
      key: 'complete_50',
      title: '50 Completions',
      description: 'Complete habits 50 times in total',
      criteriaType: 'TOTAL_COMPLETIONS',
      criteriaValue: 50,
      icon: '🏆',
      color: '#D97706',
    },
  ]

  // Create lightweight delegate-like shapes that avoid referencing Prisma's generated
  // model-specific types (which may not be available in some build setups).
  // Use `unknown` in signatures to avoid `any` lint errors.
  const { achievement: achievementClient, achievementProgress: achievementProgressClient } = prisma as unknown as {
    achievement: {
      findMany: (args?: unknown) => Promise<unknown[]>
      upsert: (args: unknown) => Promise<unknown>
    }
    achievementProgress: {
      upsert: (args: unknown) => Promise<unknown>
    }
  }

  for (const a of achievements) {
    await achievementClient.upsert({
      where: { key: a.key },
      update: {},
      create: {
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon,
        color: a.color,
        criteriaType: a.criteriaType,
        criteriaValue: a.criteriaValue,
      }
    })
  }

  console.log('🏆 Ensured achievements templates')

  // Compute user's total completions
  const totalCompletedCount = await prisma.habitRecord.count({
    where: { userId: testUser.id, completed: true }
  })

  // Create progress rows (or upsert)
  const allAchievements = (await achievementClient.findMany()) as Array<{ id: string; criteriaType: 'STREAK' | 'TOTAL_COMPLETIONS'; criteriaValue: number }>

  for (const ach of allAchievements) {
    let prog = 0
    if (ach.criteriaType === 'TOTAL_COMPLETIONS') {
      prog = Math.min(totalCompletedCount, ach.criteriaValue)
    } else {
      // For STREAK criteria, we will leave progress at 0 for the seed
      prog = 0
    }

    await achievementProgressClient.upsert({
      where: { userId_achievementId: { userId: testUser.id, achievementId: ach.id } },
      update: {
        progress: prog,
        unlocked: prog >= ach.criteriaValue,
        unlockedAt: prog >= ach.criteriaValue ? new Date() : null,
      },
      create: {
        userId: testUser.id,
        achievementId: ach.id,
        progress: prog,
        unlocked: prog >= ach.criteriaValue,
        unlockedAt: prog >= ach.criteriaValue ? new Date() : null,
      }
    })
  }

  console.log('🔓 Initialized achievement progress for test user')

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('🔑 Test Account:')
  console.log('Email: test@habitai.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

