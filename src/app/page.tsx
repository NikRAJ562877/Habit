import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Brain, Target, Star, Zap, Award, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HabitAI
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build Better Habits with
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Insights
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed max-w-4xl mx-auto">
              Track your daily habits, maintain streaks, and get personalized recommendations 
              powered by Google Gemini AI to achieve your goals faster than ever.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-2 hover:bg-white/50 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Tracking</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Simple daily check-ins with intelligent streak counters and beautiful progress visualization
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Insights</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Get personalized recommendations, motivational messages, and smart analysis from Gemini AI
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Goal Achievement</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Category-based habits with detailed analytics to help you reach your objectives consistently
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
            <Card className="relative bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl p-8 md:p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Choose HabitAI?</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl font-bold text-white">85%</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Success Rate</div>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl font-bold text-white">30+</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Habit Categories</div>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">AI Powered</div>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl font-bold text-white">24/7</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Progress Tracking</div>
                </div>
              </div>
            </Card>
          </div>

          {/* How it Works */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 mb-16">Get started in just 3 simple steps</p>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Zap className="h-3 w-3 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Set Your Habits</h3>
                <p className="text-gray-600 text-lg leading-relaxed">Create personalized habits across different categories that matter to you</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Target className="h-3 w-3 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Track Daily</h3>
                <p className="text-gray-600 text-lg leading-relaxed">Simple check-ins to mark completion and build consistent streaks</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Award className="h-3 w-3 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Get AI Insights</h3>
                <p className="text-gray-600 text-lg leading-relaxed">Receive personalized recommendations and motivation from AI analysis</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-3xl blur-3xl"></div>
            <Card className="relative bg-white/90 backdrop-blur-lg border-0 shadow-2xl rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">Loved by Habit Builders Worldwide</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4 font-medium">
                      “HabitAI transformed my morning routine completely. The AI insights are incredibly motivating and spot-on!”
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        S
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="text-sm text-gray-600">Product Manager</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4 font-medium">
                      “The streak tracking feature keeps me motivated daily. I’ve never been more consistent with my goals!”
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        M
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                        <div className="text-sm text-gray-600">Fitness Enthusiast</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4 font-medium">
                      “Simple, effective, and the AI recommendations actually work. This app changed my life!”
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        J
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Jessica Lee</div>
                        <div className="text-sm text-gray-600">Entrepreneur</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Card>
          </div>

          {/* Final CTA */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-20"></div>
            <Card className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-12 md:p-16 text-center relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Life?</h2>
                  <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Join thousands of users who are building better habits with AI-powered insights
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup">
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                      >
                        <Users className="h-5 w-5 mr-2" />
                        Start Free Today
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                HabitAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 text-lg">Building better habits, one day at a time.</p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-sm text-gray-500">© 2025 HabitAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
