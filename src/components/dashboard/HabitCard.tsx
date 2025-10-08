'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Flame, Calendar, MoreHorizontal } from 'lucide-react'
import { HabitWithStats, HabitRecord } from '@/types'
import { getDateString, calculateStreak } from '@/lib/utils'

interface HabitCardProps {
  habit: HabitWithStats
  todayRecord?: HabitRecord | undefined
  onUpdate: () => void
}

export default function HabitCard({ habit, todayRecord, onUpdate }: HabitCardProps) {
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isCompleted = todayRecord?.completed || false
  const completionRate = habit.completionRate || 0
  const currentStreak = calculateStreak(habit.records || [])

  const toggleCompletion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/habits/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId: habit.id,
          date: getDateString(new Date()),
          completed: !isCompleted
        })
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating habit:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-600'
    if (rate >= 60) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <Card 
      className={`transition-all duration-200 cursor-pointer ${
        isCompleted 
          ? 'bg-green-50 border-green-200 shadow-md' 
          : 'bg-white border-gray-200 hover:shadow-md'
      } ${isHovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: habit.color }}
            />
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <span className="text-xl">{habit.icon}</span>
                <span>{habit.name}</span>
              </CardTitle>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCompletion}
              disabled={loading}
              className={`p-2 ${
                isCompleted 
                  ? 'text-green-600 hover:text-green-700' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
              ) : isCompleted ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className={getCompletionColor(completionRate)}>
                {Math.round(completionRate)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(completionRate)}`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-600">
              <Flame className="h-4 w-4" />
              <span className="font-medium">{currentStreak}</span>
              <span className="text-gray-500">day streak</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{habit.totalCompleted || 0}</span>
              <span className="text-gray-500">completed</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="flex justify-between items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
              {habit.category}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {habit.frequency.toLowerCase()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
