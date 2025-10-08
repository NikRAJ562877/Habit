'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Flame, Trophy, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function DashboardHeader() {
  const { data: session } = useSession()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getMotivationalMessage = () => {
    const messages = [
      "Every small step counts towards your goals!",
      "Consistency is the key to building lasting habits.",
      "You're building a better version of yourself today.",
      "Progress, not perfection, is what matters.",
      "Your future self will thank you for today's efforts."
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {getGreeting()}, {session?.user?.name || 'Friend'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {formatDate(currentTime)}
            </p>
            <p className="text-blue-100 opacity-90 max-w-lg">
              {getMotivationalMessage()}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="text-blue-200 text-sm">
                Current Time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-green-700">Today</div>
                <div className="text-sm text-green-600">Your Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-orange-700">Streaks</div>
                <div className="text-sm text-orange-600">Keep it up!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-700">Weekly</div>
                <div className="text-sm text-blue-600">Overview</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-purple-700">Growth</div>
                <div className="text-sm text-purple-600">Trending up</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
