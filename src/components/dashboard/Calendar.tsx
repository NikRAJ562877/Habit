'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarDay } from '@/types'

type ApiDay = {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  habits: Array<{
    id: string
    name: string
    completed: boolean
    color: string
    icon: string
  }>
}

function monthName(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
}

export default function Calendar() {
  const today = new Date()
  const [year, setYear] = useState<number>(today.getFullYear())
  const [month, setMonth] = useState<number>(today.getMonth() + 1)
  const [days, setDays] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    const fetchMonth = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/calendar?year=${year}&month=${month}`)
        if (res.ok) {
          const data = await res.json()
          if (!mounted) return
          const parsed: CalendarDay[] = data.days.map((d: ApiDay) => ({
            date: new Date(d.date),
            isCurrentMonth: d.isCurrentMonth,
            isToday: d.isToday,
            habits: d.habits
          }))
          setDays(parsed)
        }
      } catch (e) {
        console.error('Calendar fetch error', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchMonth()
    return () => { mounted = false }
  }, [year, month])

  const prev = () => {
    if (month === 1) {
      setMonth(12)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }

  const next = () => {
    if (month === 12) {
      setMonth(1)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{monthName(year, month)}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prev} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={next} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading calendar...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-xs text-center text-muted-foreground">{d}</div>
            ))}

            {days.map((day, idx) => (
              <div key={idx} className={`min-h-[64px] border rounded p-1 ${!day.isCurrentMonth ? 'bg-gray-50 text-muted-foreground' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="text-xs font-medium">{day.date.getDate()}</div>
                  {day.isToday && <div className="text-xs text-blue-600">Today</div>}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {day.habits.slice(0,6).map(h => (
                    <div key={h.id} title={`${h.name} — ${h.completed ? 'Done' : 'Not done'}`} className="flex items-center gap-1 text-xs">
                      <span style={{ width: 10, height: 10, backgroundColor: h.color, display: 'inline-block', borderRadius: 999 }} className={`${h.completed ? '' : 'opacity-30'}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
