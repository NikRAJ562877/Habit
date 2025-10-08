import { PrismaClient } from '@prisma/client'
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
  const records = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    for (const habit of createdHabits) {
      const completed = Math.random() > 0.3
      
      records.push({
        habitId: habit.id,
        userId: testUser.id,
        date: date,
        completed: completed,
        notes: completed ? 'Done!' : undefined,
      })
    }
  }

  await Promise.all(
    records.map((record) =>
      prisma.habitRecord.create({ data: record })
    )
  )

  console.log('📊 Created habit records:', records.length)
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

