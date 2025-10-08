import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Habit, HabitRecord, HabitSuggestion } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateHabitInsights(habitData: Habit[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const completionStats = habitData.map((habit: Habit) => ({
      name: habit.name,
      category: habit.category,
      completedDays: habit.records?.filter((r: HabitRecord) => r.completed).length ?? 0,
      totalDays: habit.records?.length ?? 0,
      recentStreak: calculateStreak(habit.records ?? [])
    }))
    
    const prompt = `
      Analyze this habit tracking data and provide personalized insights:
      ${JSON.stringify(completionStats, null, 2)}
      
      Please provide an encouraging analysis in 3-4 sentences covering:
      1. Overall progress and what's going well
      2. Specific patterns you notice
      3. One actionable suggestion for improvement
      4. Motivational message for continued success
      
      Keep the tone positive, personal, and actionable. Focus on progress made.
      Write in a friendly, supportive tone as if you're a personal coach.
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    return text
  } catch (error) {
    console.error('Gemini API error:', error)
    return "Great job on tracking your habits! Keep building those positive routines, and remember that consistency is more important than perfection. Every small step counts toward your goals. Focus on progress, not perfection!"
  }
}

export async function generateHabitSuggestions(userGoals: string): Promise<HabitSuggestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
      Based on these goals: "${userGoals}"
      
      Suggest 3 specific, achievable daily habits that would help achieve these goals.
      
      Return a valid JSON array with objects containing exactly these fields:
      - name: string (specific habit name)
      - description: string (brief description of the habit)
      - category: string (one of: Health, Fitness, Productivity, Learning, Personal, Social, Finance, Career, Creativity, Mindfulness)
      
      Make suggestions practical, measurable, and beginner-friendly.
      
      Example format:
      [
        {
          "name": "Morning Meditation",
          "description": "5 minutes of mindfulness meditation",
          "category": "Mindfulness"
        }
      ]
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as HabitSuggestion[]
      }
      
      // Fallback parsing
      return JSON.parse(text.replace(/``````/g, '').trim()) as HabitSuggestion[]
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // Fallback if JSON parsing fails
      return [
        { 
          name: "Morning Exercise", 
          description: "10 minutes of physical activity to start the day", 
          category: "Health" 
        },
        { 
          name: "Daily Reading", 
          description: "Read for 15 minutes to expand knowledge", 
          category: "Learning" 
        },
        { 
          name: "Gratitude Journal", 
          description: "Write 3 things you're grateful for", 
          category: "Mindfulness" 
        }
      ]
    }
  } catch (error) {
    console.error('Gemini suggestions error:', error)
    return [
      { 
        name: "Morning Walk", 
        description: "Take a 10-minute walk to start your day", 
        category: "Health" 
      },
      { 
        name: "Deep Work Session", 
        description: "Focus on important tasks for 25 minutes", 
        category: "Productivity" 
      },
      { 
        name: "Evening Reflection", 
        description: "Spend 5 minutes reflecting on the day", 
        category: "Personal" 
      }
    ]
  }
}

function calculateStreak(records: HabitRecord[]): number {
  if (!records.length) return 0
  
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
