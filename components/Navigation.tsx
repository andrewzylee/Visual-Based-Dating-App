'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, User, Heart, MessageCircle } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { path: '/discover', icon: Heart, label: 'Match' },
    { path: '/matches', icon: MessageCircle, label: 'Chat' },
    { path: '/ideal-avatar', icon: User, label: 'Profile' },
  ]

  // Don't show navigation on landing, onboarding, or builder pages
  if (
    pathname === '/' ||
    pathname?.startsWith('/onboarding') ||
    pathname === '/self-avatar' ||
    pathname === '/ideal-avatar' ||
    pathname === '/photos'
  ) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-purple-500/30 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-purple-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

