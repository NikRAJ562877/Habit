export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  id: string
  name: string
  description?: string
  category: string
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  targetDays: number[]
  isActive: boolean
  color: string
  icon: string
  createdAt: Date
  updatedAt: Date
  userId: string
  records?: HabitRecord[]
}

export interface HabitRecord {
  id: string
  date: Date
  completed: boolean
  notes?: string | null
  createdAt: Date
  habitId: string
  userId: string
  habit?: Habit
}

export interface HabitWithStats extends Habit {
  currentStreak: number
  completionRate: number
  totalCompleted: number
  todayCompleted?: boolean
}

export interface CreateHabitData {
  name: string
  description?: string
  category: string
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  color?: string
  icon?: string
  targetDays?: number[]
}

export interface UpdateHabitData extends Partial<CreateHabitData> {
  isActive?: boolean
}

export interface HabitStats {
  totalHabits: number
  completedToday: number
  currentStreaks: number[]
  weeklyProgress: { day: string; completed: number }[]
  completionRate: number
  longestStreak: number
}

export interface AIInsight {
  type: 'insight' | 'suggestion' | 'motivation'
  content: string
  timestamp: Date
}

export interface HabitSuggestion {
  name: string
  description: string
  category: string
  icon?: string
  color?: string
}

export interface UserPreferences {
  notifications: {
    daily: boolean
    weekly: boolean
    streaks: boolean
  }
  privacy: {
    shareStats: boolean
    publicProfile: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY'
    weekStartsOn: 0 | 1 // 0 = Sunday, 1 = Monday
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

export interface HabitFormData {
  name: string
  description: string
  category: string
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  color: string
  icon: string
  targetDays: number[]
}

// Calendar types
export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  habits: {
    id: string
    name: string
    completed: boolean
    color: string
    icon: string
  }[]
}

// Achievement types
export interface Achievement {
  id: string
  key: string
  title: string
  description?: string
  icon?: string
  color?: string
  criteriaType: 'STREAK' | 'TOTAL_COMPLETIONS'
  criteriaValue: number
  createdAt: Date
}

export interface AchievementProgress {
  id: string
  userId: string
  achievementId: string
  progress: number
  unlocked: boolean
  unlockedAt?: Date | null
  achievement?: Achievement
}

// Analytics types
export interface HabitAnalytics {
  habitId: string
  habitName: string
  totalDays: number
  completedDays: number
  completionRate: number
  currentStreak: number
  longestStreak: number
  averagePerWeek: number
  trendDirection: 'up' | 'down' | 'stable'
}

export interface WeeklyProgress {
  week: string
  habits: {
    [habitId: string]: {
      name: string
      completed: number
      total: number
      rate: number
    }
  }
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
