'use client'

import { useState } from 'react'
import { LifestylePreferences, LifestyleCategory } from '@/types'
import { Plus, Minus } from 'lucide-react'

interface LifestyleBlocksProps {
  preferences: LifestylePreferences
  onChange: (preferences: LifestylePreferences) => void
}

const LIFESTYLE_CATEGORIES: {
  key: LifestyleCategory
  label: string
  icon: string
  color: string
}[] = [
  { key: 'active', label: 'Active Lifestyle', icon: '🏃', color: 'from-green-500 to-emerald-600' },
  { key: 'nightlife', label: 'Nightlife / Social', icon: '🌃', color: 'from-purple-500 to-pink-600' },
  { key: 'academic', label: 'Academics / Career', icon: '📚', color: 'from-blue-500 to-cyan-600' },
  { key: 'creative', label: 'Creative Pursuits', icon: '🎨', color: 'from-orange-500 to-red-600' },
  { key: 'wellness', label: 'Wellness / Health', icon: '🧘', color: 'from-teal-500 to-green-600' },
]

const MAX_POINTS = 10

export default function LifestyleBlocks({ preferences, onChange }: LifestyleBlocksProps) {
  const totalPoints = Object.values(preferences).reduce((sum, val) => sum + val, 0)
  const remainingPoints = MAX_POINTS - totalPoints

  const adjustPoints = (category: LifestyleCategory, delta: number) => {
    const current = preferences[category] || 0
    const newValue = Math.max(0, Math.min(MAX_POINTS, current + delta))
    
    // Check if we have enough remaining points (for increases) or if we're decreasing
    const newTotal = totalPoints - current + newValue
    if (delta > 0 && newTotal > MAX_POINTS) return
    if (delta < 0 && newValue < 0) return

    onChange({
      ...preferences,
      [category]: newValue,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium text-slate-300">Lifestyle Preferences</label>
        <div className="text-xs text-slate-400">
          <span className={remainingPoints < 0 ? 'text-red-400' : remainingPoints === 0 ? 'text-green-400' : ''}>
            {remainingPoints} points remaining
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {LIFESTYLE_CATEGORIES.map((category) => {
          const value = preferences[category.key] || 0
          const canIncrease = remainingPoints > 0 && value < MAX_POINTS
          const canDecrease = value > 0

          return (
            <div
              key={category.key}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium text-slate-300">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustPoints(category.key, -1)}
                    disabled={!canDecrease}
                    className={`p-1 rounded transition-colors ${
                      canDecrease
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-purple-400 w-8 text-center">{value}</span>
                  <button
                    onClick={() => adjustPoints(category.key, 1)}
                    disabled={!canIncrease}
                    className={`p-1 rounded transition-colors ${
                      canIncrease
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Visual bar */}
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${category.color} transition-all duration-300`}
                  style={{ width: `${(value / MAX_POINTS) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {remainingPoints < 0 && (
        <div className="text-xs text-red-400 mt-2">
          ⚠️ You've exceeded the limit. Reduce some values.
        </div>
      )}
    </div>
  )
}

