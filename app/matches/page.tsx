'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

// Mock matches (in real app, fetch from API)
const mockMatches = [
  {
    id: '1',
    name: 'Alex',
    photo: '/api/placeholder/200/300',
    lastMessage: 'Hey! How are you?',
    timestamp: '2h ago',
  },
  {
    id: '2',
    name: 'Sam',
    photo: '/api/placeholder/200/300',
    lastMessage: 'Love your style!',
    timestamp: '1d ago',
  },
]

export default function MatchesPage() {
  const router = useRouter()
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Messages
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="game-card cursor-pointer hover:border-purple-500/50 transition-colors"
              onClick={() => router.push(`/chat/${match.id}`)}
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{match.name}</h3>
                  <p className="text-sm text-slate-400 truncate mb-2">
                    {match.lastMessage}
                  </p>
                  <p className="text-xs text-slate-500">{match.timestamp}</p>
                </div>
                <MessageCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        {mockMatches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No messages yet.</p>
            <p className="text-sm text-slate-500">
              Start a conversation with your match to see messages here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

