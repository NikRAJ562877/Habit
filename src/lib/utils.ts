import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { HabitRecord } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function calculateStreak(records: HabitRecord[]) {
  if (!records || records.length === 0) return 0

  const completedRecords = records
    .filter(r => r.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const record of completedRecords) {
    const recordDate = new Date(record.date)
    recordDate.setHours(0, 0, 0, 0)

    const diffTime = currentDate.getTime() - recordDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
    } else if (diffDays > streak) {
      break
    }
  }

  return streak
}

export function getRelativeTime(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

export function getStreakEmoji(streak: number) {
  if (streak >= 100) return '💯'
  if (streak >= 50) return '🏆'
  if (streak >= 30) return '👑'
  if (streak >= 14) return '🔥'
  if (streak >= 7) return '⚡'
  if (streak >= 3) return '🌟'
  return '💪'
}

export function getCompletionRateColor(rate: number) {
  if (rate >= 80) return 'text-green-600'
  if (rate >= 60) return 'text-yellow-600'
  if (rate >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getCompletionRateBgColor(rate: number) {
  if (rate >= 80) return 'bg-green-100'
  if (rate >= 60) return 'bg-yellow-100'
  if (rate >= 40) return 'bg-orange-100'
  return 'bg-red-100'
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
