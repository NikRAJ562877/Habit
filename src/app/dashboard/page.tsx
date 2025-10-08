'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import HabitCard from '@/components/dashboard/HabitCard'
import AIInsights from '@/components/dashboard/AIInsights'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Plus, TrendingUp, Target, Calendar } from 'lucide-react'
import Link from 'next/link'
import { HabitWithStats, HabitRecord } from '@/types'

export default function Dashboard() {
  const [habits, setHabits] = useState<HabitWithStats[]>([])
  const [todayRecords, setTodayRecords] = useState<HabitRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
    fetchTodayRecords()
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

  const fetchTodayRecords = async () => {
    const today = new Date().toISOString().split('T')[0]
    try {
      const response = await fetch(`/api/habits/records?date=${today}`)
      if (response.ok) {
        const data = await response.json()
        setTodayRecords(data)
      }
    } catch (error) {
      console.error('Error fetching today records:', error)
    }
  }

  const completedToday = todayRecords.filter(record => record.completed).length
  const totalActiveHabits = habits.length
  const completionRate = totalActiveHabits > 0 ? Math.round((completedToday / totalActiveHabits) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}/{totalActiveHabits}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveHabits}</div>
            <p className="text-xs text-muted-foreground">
              Currently tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...habits.map(h => h.currentStreak), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habits.reduce((sum, habit) => sum + habit.totalCompleted, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total completions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Habits Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Today&apos;s Habits</h2>
            <Link href="/dashboard/habits">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Habit
              </Button>
            </Link>
          </div>

          {habits.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Target className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building better habits by creating your first one!
                </p>
                <Link href="/dashboard/habits">
                  <Button>Create Your First Habit</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  todayRecord={todayRecords.find((r: HabitRecord) => r.habitId === habit.id)}
                  onUpdate={fetchTodayRecords}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          <AIInsights />
        </div>
      </div>
    </div>
  )
}
