'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { AchievementProgress } from '@/types'

export default function Achievements() {
  const [items, setItems] = useState<AchievementProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAchievements() }, [])

  const fetchAchievements = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/achievements')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (e) {
      console.error('Achievements fetch error', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading achievements...</div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: item.achievement?.color || '#F3F4F6' }}>
                  <span className="text-xl">{item.achievement?.icon || '🏆'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{item.achievement?.title}</div>
                    <div className={`text-xs ${item.unlocked ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {item.unlocked ? 'Unlocked' : `${item.progress}/${item.achievement?.criteriaValue}`}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={Math.min(100, Math.round((item.progress / (item.achievement?.criteriaValue || 1)) * 100))} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
