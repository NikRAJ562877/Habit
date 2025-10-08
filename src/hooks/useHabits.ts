'use client'

import { useState, useEffect, useCallback } from 'react'
import { HabitWithStats, CreateHabitData, UpdateHabitData } from '@/types'
import type { HabitRecord } from '@/types'

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/habits')
      if (!response.ok) {
        throw new Error('Failed to fetch habits')
      }
      
      const data = await response.json()
      setHabits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching habits:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createHabit = useCallback(async (habitData: CreateHabitData) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create habit')
      }

      const newHabit = await response.json()
      setHabits(prev => [...prev, newHabit])
      return newHabit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create habit'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateHabit = useCallback(async (habitId: string, updates: UpdateHabitData) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update habit')
      }

      // Refresh habits after update
      await fetchHabits()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update habit'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchHabits])

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete habit')
      }

      setHabits(prev => prev.filter(habit => habit.id !== habitId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete habit'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const toggleHabitCompletion = useCallback(async (habitId: string, date: string, completed: boolean) => {
    try {
      const response = await fetch('/api/habits/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitId,
          date,
          completed,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update habit record')
      }

      // Refresh habits to get updated stats
      await fetchHabits()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update habit record'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchHabits])

  const getHabitById = useCallback((habitId: string) => {
    return habits.find(habit => habit.id === habitId)
  }, [habits])

  const getHabitsByCategory = useCallback((category: string) => {
    return habits.filter(habit => habit.category === category)
  }, [habits])

  const getCompletedHabitsToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return habits.filter(habit => 
      habit.records?.some(record => 
        record.date.toString().split('T')[0] === today && record.completed
      )
    )
  }, [habits])

  const getTotalStreaks = useCallback(() => {
    return habits.reduce((total, habit) => total + habit.currentStreak, 0)
  }, [habits])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitById,
    getHabitsByCategory,
    getCompletedHabitsToday,
    getTotalStreaks,
  }
}

// Custom hook for habit records
export function useHabitRecords(habitId?: string) {
  const [records, setRecords] = useState<HabitRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async (startDate?: string, endDate?: string) => {
    if (!habitId) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/habits/${habitId}/records?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch habit records')
      }

      const data = await response.json()
      // Ensure record dates are Date objects to match the HabitRecord type
      const toRecord = (r: unknown): HabitRecord | null => {
        if (typeof r !== 'object' || r === null) return null
        const obj = r as Record<string, unknown>
        if (typeof obj.id !== 'string') return null

        const date = obj.date ? new Date(String(obj.date)) : new Date()
        const createdAt = obj.createdAt ? new Date(String(obj.createdAt)) : new Date()

        return {
          id: String(obj.id),
          date,
          completed: Boolean(obj.completed),
          notes: typeof obj.notes === 'string' ? obj.notes : undefined,
          createdAt,
          habitId: typeof obj.habitId === 'string' ? obj.habitId : '',
          userId: typeof obj.userId === 'string' ? obj.userId : '',
          habit: undefined,
        } as HabitRecord
      }

      setRecords(Array.isArray(data) ? data.map(toRecord).filter((x): x is HabitRecord => x !== null) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching habit records:', err)
    } finally {
      setLoading(false)
    }
  }, [habitId])

  useEffect(() => {
    if (habitId) {
      fetchRecords()
    }
  }, [habitId, fetchRecords])

  return {
    records,
    loading,
    error,
    fetchRecords,
  }
}
