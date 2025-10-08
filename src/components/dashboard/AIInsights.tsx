'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, Lightbulb, Target } from 'lucide-react'
import type { HabitSuggestion } from '@/types'

export default function AIInsights() {
  const [insights, setInsights] = useState('')
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'insights' | 'suggestions'>('insights')

  const generateInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'insights' })
      })
      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      console.error('Error generating insights:', error)
      setInsights('Unable to generate insights at the moment. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'suggestions',
          data: { goals: 'improve overall wellness and productivity' }
        })
      })
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-generate insights on component mount
    generateInsights()
  }, [])

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI Assistant
        </CardTitle>
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'insights'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Suggestions
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'insights' ? (
          <div className="space-y-4">
            {insights ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                      {insights}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={generateInsights}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh Insights</span>
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Get personalized insights about your habits and progress
                </p>
                <Button onClick={generateInsights} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate AI Insights'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Target className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-800 mb-1">
                          {suggestion.name}
                        </div>
                        <div className="text-sm text-green-700">
                          {suggestion.description}
                        </div>
                        <div className="text-xs text-green-600 mt-1 capitalize">
                          {suggestion.category}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={generateSuggestions}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>New Suggestions</span>
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Get AI-powered habit suggestions tailored to your goals
                </p>
                <Button onClick={generateSuggestions} disabled={loading}>
                  {loading ? 'Generating...' : 'Get Suggestions'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
