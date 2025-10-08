'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Habit, CreateHabitData } from '@/types'

interface HabitFormProps {
  habit?: Habit | null
  onSave: () => void
  onCancel: () => void
}

const CATEGORIES = [
  'Health', 'Fitness', 'Productivity', 'Learning', 'Personal', 
  'Social', 'Finance', 'Career', 'Creativity', 'Mindfulness'
]

const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' }
]

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280'
]

const ICONS = [
  '💪', '🏃', '📚', '💻', '🧘', '💧', '🥗', '😴', '🎯', '📝',
  '🎨', '💰', '🤝', '📱', '🎵', '🌱', '🔥', '⭐', '🚀', '💡'
]

export default function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [formData, setFormData] = useState<CreateHabitData>({
    name: '',
    description: '',
    category: 'Health',
    frequency: 'DAILY',
    color: '#3B82F6',
    icon: '💪'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        category: habit.category,
        frequency: habit.frequency,
        color: habit.color,
        icon: habit.icon
      })
    }
  }, [habit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = habit ? `/api/habits/${habit.id}` : '/api/habits'
      const method = habit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSave()
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      console.error('HabitForm submit error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Habit Name *
          </label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Drink 8 glasses of water"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Optional description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency *
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'DAILY' | 'WEEKLY' | 'MONTHLY' })}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            {FREQUENCIES.map(freq => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customization */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose an Icon
          </label>
          <div className="grid grid-cols-10 gap-2">
            {ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`p-2 text-xl rounded-lg border-2 transition-colors ${
                  formData.icon === icon
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  formData.color === color
                    ? 'border-gray-400 scale-110'
                    : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{habit ? 'Updating...' : 'Creating...'}</span>
            </div>
          ) : (
            habit ? 'Update Habit' : 'Create Habit'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}
