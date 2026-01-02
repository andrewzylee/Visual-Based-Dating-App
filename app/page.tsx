'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-2xl"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Visual Compatibility
        </h1>
        <p className="text-xl text-slate-300">
          Match based on visual preferences. Build your ideal partner like a video game character.
        </p>
        <button
          onClick={() => router.push('/onboarding')}
          className="game-button text-lg px-8 py-4"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  )
}

