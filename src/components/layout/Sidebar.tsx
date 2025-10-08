'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Settings, 
  User,
  Brain,
  Calendar,
  Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Habits',
    href: '/dashboard/habits',
    icon: Target,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'AI Insights',
    href: '/dashboard/insights',
    icon: Brain,
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    name: 'Achievements',
    href: '/dashboard/achievements',
    icon: Trophy,
  },
]

const secondaryNavigation = [
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-16">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {/* Primary Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </h3>
              </div>
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-xs text-gray-500">
                Building better habits with AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
