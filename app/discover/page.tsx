'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getBestMatch } from '@/lib/matching'
import { User, Match } from '@/types'

// Mock users for demo (in real app, fetch from API)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    gender: 'male',
    showTo: ['female', 'non-binary'],
    photos: ['/api/placeholder/400/600'],
    selfAvatar: {
      body: {
        height: 170,
        weight: 65,
        build: 'athletic',
        shoulderWidth: 50,
        posture: 'upright',
      },
      face: {
        faceShape: 'oval',
        jawlineSharpness: 55,
        cheekboneProminence: 65,
        eyeShape: 'neutral',
        noseSize: 50,
        lipFullness: 60,
      },
      hair: {
        length: 'medium',
        texture: 'wavy',
        facialHair: 20,
      },
      style: {
        archetypes: ['fashion-forward', 'creative'],
        clothingStyle: 70,
      },
      presence: {
        energyLevel: 60,
        expressionBaseline: 65,
      },
    },
    idealAvatar: {
      body: {
        height: 165,
        weight: 60,
        build: 'athletic',
        shoulderWidth: 45,
        posture: 'upright',
      },
      face: {
        faceShape: 'oval',
        jawlineSharpness: 60,
        cheekboneProminence: 70,
        eyeShape: 'upturned',
        noseSize: 40,
        lipFullness: 70,
      },
      hair: {
        length: 'long',
        texture: 'wavy',
        facialHair: 0,
      },
      style: {
        archetypes: ['fashion-forward', 'creative'],
        clothingStyle: 75,
      },
      presence: {
        energyLevel: 60,
        expressionBaseline: 65,
      },
    },
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'user2@example.com',
    gender: 'female',
    showTo: ['male', 'non-binary'],
    photos: ['/api/placeholder/400/600'],
    selfAvatar: {
      body: {
        height: 165,
        weight: 58,
        build: 'athletic',
        shoulderWidth: 45,
        posture: 'upright',
      },
      face: {
        faceShape: 'round',
        jawlineSharpness: 50,
        cheekboneProminence: 60,
        eyeShape: 'neutral',
        noseSize: 45,
        lipFullness: 65,
      },
      hair: {
        length: 'long',
        texture: 'wavy',
        facialHair: 0,
      },
      style: {
        archetypes: ['athlete', 'minimalist'],
        clothingStyle: 45,
      },
      presence: {
        energyLevel: 55,
        expressionBaseline: 60,
      },
    },
    idealAvatar: {
      body: {
        height: 180,
        weight: 80,
        build: 'muscular',
        shoulderWidth: 70,
        posture: 'upright',
      },
      face: {
        faceShape: 'angular',
        jawlineSharpness: 80,
        cheekboneProminence: 60,
        eyeShape: 'neutral',
        noseSize: 50,
        lipFullness: 50,
      },
      hair: {
        length: 'short',
        texture: 'straight',
        facialHair: 30,
      },
      style: {
        archetypes: ['athlete', 'minimalist'],
        clothingStyle: 40,
      },
      presence: {
        energyLevel: 70,
        expressionBaseline: 75,
      },
    },
    createdAt: new Date(),
  },
]

export default function DiscoverPage() {
  const router = useRouter()
  const { currentUser, selfAvatarBuilder, idealAvatarBuilder, photos } = useStore()
  const [match, setMatch] = useState<Match | null>(null)
  const [matchUser, setMatchUser] = useState<User | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Create a mock current user from the builders
    if (!currentUser && selfAvatarBuilder.body && idealAvatarBuilder.body) {
      const mockCurrentUser: User = {
        id: 'current',
        email: 'current@example.com',
        gender: 'male',
        showTo: ['female', 'non-binary'],
        photos: photos,
        selfAvatar: selfAvatarBuilder as any,
        idealAvatar: idealAvatarBuilder as any,
        createdAt: new Date(),
      }
      
      // Simulate loading/match calculation
      setTimeout(() => {
        const bestMatch = getBestMatch(mockCurrentUser, mockUsers)
        if (bestMatch) {
          const matchedUser = mockUsers.find((u) => u.id === bestMatch.userId)
          setMatch(bestMatch)
          setMatchUser(matchedUser || null)
        }
        setIsLoading(false)
      }, 1500) // Simulate calculation time
    }
  }, [currentUser, selfAvatarBuilder, idealAvatarBuilder, photos])

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const handleStartChat = () => {
    if (match) {
      router.push(`/chat/${match.userId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mx-auto w-16 h-16"
          >
            <Sparkles className="w-full h-full text-purple-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Finding Your Match
            </h2>
            <p className="text-slate-400">
              Analyzing compatibility...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!match || !matchUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Match Found</h2>
          <p className="text-slate-400 mb-6">
            We couldn't find a compatible match for you right now. Check back later as more people join!
          </p>
          <button
            onClick={() => router.push('/ideal-avatar')}
            className="game-button"
          >
            Update Preferences
          </button>
        </div>
      </div>
    )
  }

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'high':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-orange-400'
      default:
        return 'text-slate-400'
    }
  }

  const getCompatibilityBg = (compatibility: string) => {
    switch (compatibility) {
      case 'high':
        return 'bg-green-500/20 border-green-500/50'
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50'
      case 'low':
        return 'bg-orange-500/20 border-orange-500/50'
      default:
        return 'bg-slate-700/50 border-slate-600'
    }
  }

  if (!isRevealed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Match is Ready
            </h1>
            <p className="text-xl text-slate-300">
              We've found your most compatible partner based on visual compatibility.
            </p>
            <div className={`p-6 rounded-lg border ${getCompatibilityBg(match.compatibility)}`}>
              <div className="text-sm text-slate-400 mb-2">Compatibility Score</div>
              <div className={`text-4xl font-bold ${getCompatibilityColor(match.compatibility)}`}>
                {(match.mutualScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          
          <button
            onClick={handleReveal}
            className="w-full game-button text-lg px-8 py-4"
          >
            Reveal Your Match
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Match
            </h1>
            <p className="text-slate-400">
              Your most compatible partner based on visual preferences
            </p>
          </div>

          {/* Match Card */}
          <div className="game-card">
            {/* Photo */}
            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 bg-slate-700">
              <img
                src={matchUser.photos[0] || '/api/placeholder/400/600'}
                alt="Match"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Compatibility Badge */}
            <div
              className={`mb-6 p-4 rounded-lg border ${getCompatibilityBg(
                match.compatibility
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">
                  Visual Compatibility:
                </span>
                <span
                  className={`text-2xl font-bold capitalize ${getCompatibilityColor(
                    match.compatibility
                  )}`}
                >
                  {match.compatibility}
                </span>
              </div>
              <div className="text-sm text-slate-400">
                Mutual Score: {(match.mutualScore * 100).toFixed(1)}%
              </div>
              <div className="mt-2 text-xs text-slate-500">
                You match their ideal type: {(match.score * 100).toFixed(1)}%
              </div>
            </div>

            {/* Why you match */}
            <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-purple-500/30">
              <h3 className="text-sm font-semibold mb-3 text-purple-400">
                Why You Match:
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                {matchUser.idealAvatar.style.archetypes.length > 0 && (
                  <div>
                    <span className="font-medium">Shared Aesthetic: </span>
                    {matchUser.idealAvatar.style.archetypes
                      .slice(0, 2)
                      .map((a) => a.replace('-', ' '))
                      .join(', ')}
                  </div>
                )}
                <div>
                  <span className="font-medium">Visual Compatibility: </span>
                  {match.compatibility === 'high' && 'Highly compatible visual preferences'}
                  {match.compatibility === 'medium' && 'Moderately compatible visual preferences'}
                  {match.compatibility === 'low' && 'Some visual compatibility'}
                </div>
                {matchUser.idealAvatar.personality && (
                  <div>
                    <span className="font-medium">Personality Match: </span>
                    {matchUser.idealAvatar.personality.casualLongterm > 70
                      ? 'Both seeking long-term connections'
                      : matchUser.idealAvatar.personality.casualLongterm < 30
                      ? 'Both open to casual connections'
                      : 'Flexible relationship preferences'}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartChat}
              className="w-full game-button text-lg py-4 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Start Conversation
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-slate-500">
            This match is based on mutual visual compatibility. 
            You both align with each other's ideal preferences.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
