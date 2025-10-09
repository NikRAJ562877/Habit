import AIInsights from '@/components/dashboard/AIInsights'

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Insights</h1>
          <p className="text-gray-600">Personalized recommendations and suggestions powered by Gemini AI</p>
        </div>
      </div>

      <div className="mt-4">
        <AIInsights />
      </div>
    </div>
  )
}
