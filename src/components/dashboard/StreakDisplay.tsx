'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flame, Calendar, Trophy } from 'lucide-react'
import { HabitWithStats } from '@/types'

interface StreakDisplayProps {
  habit: HabitWithStats
}

export default function StreakDisplay({ habit }: StreakDisplayProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600'
    if (streak >= 14) return 'text-blue-600'
    if (streak >= 7) return 'text-green-600'
    if (streak >= 3) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Trophy className="h-5 w-5" />
    if (streak >= 7) return <Flame className="h-5 w-5" />
    return <Calendar className="h-5 w-5" />
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Amazing consistency!'
    if (streak >= 14) return 'Great momentum!'
    if (streak >= 7) return 'Building strong habits!'
    if (streak >= 3) return 'Keep it up!'
    return 'Good start!'
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{habit.icon}</span>
          <div>
            <div className="font-medium text-gray-900">{habit.name}</div>
            <div className="text-sm text-gray-600">{getStreakMessage(habit.currentStreak)}</div>
          </div>
        </div>
      </div>
      <div className={`flex items-center space-x-2 ${getStreakColor(habit.currentStreak)}`}>
        {getStreakIcon(habit.currentStreak)}
        <div className="text-right">
          <div className="text-lg font-bold">{habit.currentStreak}</div>
          <div className="text-xs opacity-75">days</div>
        </div>
      </div>
    </div>
  )
}
