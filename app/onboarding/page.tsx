'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Gender } from '@/types'
import { useStore } from '@/lib/store'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<Gender | null>(null)
  const [showTo, setShowTo] = useState<Gender[]>([])
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false)

  const handleGenderSelect = (g: Gender) => {
    setGender(g)
  }

  const toggleShowTo = (g: Gender) => {
    setShowTo((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  const handleNext = () => {
    if (step === 0 && (email || phone)) {
      setStep(1)
    } else if (step === 1 && gender) {
      setStep(2)
    } else if (step === 2 && showTo.length > 0) {
      setStep(3)
    } else if (step === 3 && acceptedDisclaimer) {
      router.push('/self-avatar')
    }
  }

  const genders: Gender[] = ['male', 'female', 'non-binary', 'prefer-not-to-say']

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="game-card max-w-2xl w-full"
      >
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i <= step ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {step === 0 && 'Sign Up'}
            {step === 1 && 'Your Gender'}
            {step === 2 && 'Who to Show You To'}
            {step === 3 && 'Disclaimer'}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div className="text-center text-slate-400">or</div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderSelect(g)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    gender === g
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <span className="capitalize">{g.replace('-', ' ')}</span>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="showto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <p className="text-slate-400 mb-4">
                Select who you want to be shown to (you can select multiple)
              </p>
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleShowTo(g)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    showTo.includes(g)
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <span className="capitalize">{g.replace('-', ' ')}</span>
                </button>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="disclaimer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/50 p-6 rounded-lg border border-yellow-500/30">
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                  Important Notice
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  This app matches people using visual compatibility. Preferences are probabilistic, not absolute. 
                  We believe that attraction is complex and multi-dimensional, and visual preferences are just 
                  one aspect of what makes connections meaningful.
                </p>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedDisclaimer}
                  onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500"
                />
                <span>I understand and agree to continue</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (step === 0 && !email && !phone) ||
              (step === 1 && !gender) ||
              (step === 2 && showTo.length === 0) ||
              (step === 3 && !acceptedDisclaimer)
            }
            className="flex-1 game-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Start Building' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

