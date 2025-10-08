'use client'

import { useState, useCallback } from 'react'
import type { Habit, HabitWithStats, HabitSuggestion } from '@/types'

export function useAI() {
  const [insights, setInsights] = useState<string>('')
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'insights' }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate insights')
      }

      const data = await response.json()
      setInsights(data.insights)
      return data.insights
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights'
      setError(errorMessage)
      setInsights('Unable to generate insights at the moment. Please try again later.')
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const generateSuggestions = useCallback(async (goals?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'suggestions',
          data: { goals: goals || 'improve overall wellness and productivity' }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
      return data.suggestions
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions'
      setError(errorMessage)
      setSuggestions([])
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearInsights = useCallback(() => {
    setInsights('')
    setError(null)
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  return {
    insights,
    suggestions,
    loading,
    error,
    generateInsights,
    generateSuggestions,
    clearInsights,
    clearSuggestions,
  }
}

// Custom hook for AI-powered habit analysis
export function useHabitAnalysis() {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeHabit = useCallback(async (habitData: Habit | HabitWithStats) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'analysis',
          data: { habit: habitData }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze habit')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      return data.analysis
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze habit'
      setError(errorMessage)
      console.error('analyzeHabit error:', err)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    analysis,
    loading,
    error,
    analyzeHabit,
  }
}
