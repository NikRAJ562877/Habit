import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HabitAI - Build Better Habits with AI',
  description: 'Track your daily habits and get AI-powered insights to achieve your goals faster. Built with Next.js and Google Gemini AI.',
  keywords: 'habit tracker, AI insights, productivity, goal setting, daily habits',
  authors: [{ name: 'HabitAI Team' }],
  openGraph: {
    title: 'HabitAI - Build Better Habits with AI',
    description: 'Track your daily habits and get AI-powered insights to achieve your goals faster.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
