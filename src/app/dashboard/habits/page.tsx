'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import HabitForm from '@/components/dashboard/HabitForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, TrendingUp } from 'lucide-react'
import { Habit } from '@/types'

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

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

  const handleHabitSaved = () => {
    fetchHabits()
    setIsFormOpen(false)
    setEditingHabit(null)
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchHabits()
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const categories = Array.from(new Set(habits.map(h => h.category)))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Habits</h1>
          <p className="text-gray-600">Create and organize your daily habits</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </DialogTitle>
            </DialogHeader>
            <HabitForm
              habit={editingHabit}
              onSave={handleHabitSaved}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingHabit(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <TrendingUp className="h-20 w-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No habits created yet</h3>
            <p className="text-gray-600 mb-6">
              Start your journey by creating your first habit. Choose something small and achievable!
            </p>
            <Button onClick={() => setIsFormOpen(true)} size="lg">
              Create Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 capitalize">
                {category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits
                  .filter(habit => habit.category === category)
                  .map(habit => (
                    <Card key={habit.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{habit.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{habit.name}</CardTitle>
                              <p className="text-sm text-gray-500 capitalize">
                                {habit.frequency.toLowerCase()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingHabit(habit)
                                setIsFormOpen(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {habit.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {habit.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="text-xs text-gray-500">
                            Created {new Date(habit.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
