'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const passwordValidation = {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password)
  }

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Account created successfully! Please sign in.')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Create Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {password && (
              <div className="space-y-1 text-xs">
                <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>At least 6 characters</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>One number</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !isPasswordValid}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
