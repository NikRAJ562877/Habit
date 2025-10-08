'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import StreakDisplay from '@/components/dashboard/StreakDisplay'
import { CalendarDays, TrendingUp, Target, Award } from 'lucide-react'
import { HabitWithStats } from '@/types'

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<HabitWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      const data = await response.json()
      setHabits(data)
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalHabits = habits.length
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompleted, 0)
  const averageCompletion = totalHabits > 0 
    ? habits.reduce((sum, habit) => sum + habit.completionRate, 0) / totalHabits 
    : 0
  const longestStreak = Math.max(...habits.map(h => h.currentStreak), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600">Track your progress and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
            <p className="text-xs text-muted-foreground">
              Active habits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletions}</div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageCompletion)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all habits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{longestStreak}</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Habit Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{habit.icon}</span>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.round(habit.completionRate)}%
                  </span>
                </div>
                <Progress value={habit.completionRate} className="h-2" />
              </div>
            ))}
            {habits.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No habits to analyze yet. Create some habits to see your performance!
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits
                .filter(habit => habit.currentStreak > 0)
                .sort((a, b) => b.currentStreak - a.currentStreak)
                .map((habit) => (
                  <StreakDisplay key={habit.id} habit={habit} />
                ))}
              {habits.filter(habit => habit.currentStreak > 0).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No active streaks yet. Complete some habits to build your streaks!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(habits.map(h => h.category))).map(category => {
              const categoryHabits = habits.filter(h => h.category === category)
              const categoryCompletions = categoryHabits.reduce((sum, h) => sum + h.totalCompleted, 0)
              const categoryAverage = categoryHabits.length > 0 
                ? categoryHabits.reduce((sum, h) => sum + h.completionRate, 0) / categoryHabits.length 
                : 0

              return (
                <div key={category} className="p-4 border rounded-lg">
                  <h3 className="font-semibold capitalize mb-2">{category}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Habits:</span>
                      <span>{categoryHabits.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completions:</span>
                      <span>{categoryCompletions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average:</span>
                      <span>{Math.round(categoryAverage)}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
