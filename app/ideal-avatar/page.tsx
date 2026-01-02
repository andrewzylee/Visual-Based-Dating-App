'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import AvatarPreview from '@/components/AvatarPreview'
import Slider from '@/components/Slider'
import PersonalitySlider from '@/components/PersonalitySlider'
import LifestyleBlocks from '@/components/LifestyleBlocks'
import {
  BodyBuild,
  Posture,
  FaceShape,
  EyeShape,
  HairLength,
  HairTexture,
  AestheticArchetype,
  LifestylePreferences,
} from '@/types'

const SECTIONS = ['body', 'face', 'hair', 'style', 'personality', 'lifestyle'] as const
type Section = (typeof SECTIONS)[number]

export default function BuilderPage() {
  const router = useRouter()
  const { idealAvatarBuilder, updateIdealAvatar } = useStore()
  const [activeSection, setActiveSection] = useState<Section>('body')

  const handleBodyUpdate = (key: string, value: any) => {
    updateIdealAvatar('body', { [key]: value })
  }

  const handleFaceUpdate = (key: string, value: any) => {
    updateIdealAvatar('face', { [key]: value })
  }

  const handleHairUpdate = (key: string, value: any) => {
    updateIdealAvatar('hair', { [key]: value })
  }

  const handleStyleUpdate = (key: string, value: any) => {
    updateIdealAvatar('style', { [key]: value })
  }

  const handlePresenceUpdate = (key: string, value: any) => {
    updateIdealAvatar('presence', { [key]: value })
  }

  const handlePersonalityUpdate = (key: string, value: number) => {
    updateIdealAvatar('personality', {
      ...idealAvatarBuilder.personality,
      [key]: value,
    })
  }

  const handleLifestyleUpdate = (lifestyle: LifestylePreferences) => {
    updateIdealAvatar('lifestyle', lifestyle)
  }

  const toggleArchetype = (archetype: AestheticArchetype) => {
    const current = idealAvatarBuilder.style?.archetypes || []
    const updated = current.includes(archetype)
      ? current.filter((a) => a !== archetype)
      : [...current, archetype]
    handleStyleUpdate('archetypes', updated)
  }

  const handleContinue = () => {
    router.push('/discover')
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Build Your Ideal Avatar
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Create your ideal match using game-style sliders. This is what you're attracted to, not how you look.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Preview */}
          <div className="lg:col-span-2">
            <div className="game-card h-[600px]">
              <AvatarPreview preferences={idealAvatarBuilder} />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Section Tabs */}
            <div className="game-card">
              <div className="flex flex-wrap gap-2 mb-6">
                {SECTIONS.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === section
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-6">
                <AnimatePresence mode="wait">
                  {activeSection === 'body' && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <Slider
                        label="Height"
                        value={idealAvatarBuilder.body?.height || 175}
                        min={150}
                        max={200}
                        unit="cm"
                        onChange={(v) => handleBodyUpdate('height', v)}
                      />
                      <Slider
                        label="Weight"
                        value={idealAvatarBuilder.body?.weight || 70}
                        min={45}
                        max={120}
                        unit="kg"
                        onChange={(v) => handleBodyUpdate('weight', v)}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Build
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['slim', 'athletic', 'muscular', 'stocky'] as BodyBuild[]).map(
                            (build) => (
                              <button
                                key={build}
                                onClick={() => handleBodyUpdate('build', build)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  idealAvatarBuilder.body?.build === build
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                                }`}
                              >
                                <span className="capitalize text-sm">{build}</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <Slider
                        label="Shoulder Width"
                        value={idealAvatarBuilder.body?.shoulderWidth || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleBodyUpdate('shoulderWidth', v)}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Posture
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['upright', 'relaxed'] as Posture[]).map((posture) => (
                            <button
                              key={posture}
                              onClick={() => handleBodyUpdate('posture', posture)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                idealAvatarBuilder.body?.posture === posture
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                              }`}
                            >
                              <span className="capitalize text-sm">{posture}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'face' && (
                    <motion.div
                      key="face"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Face Shape
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            ['oval', 'angular', 'round', 'square', 'heart'] as FaceShape[]
                          ).map((shape) => (
                            <button
                              key={shape}
                              onClick={() => handleFaceUpdate('faceShape', shape)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                idealAvatarBuilder.face?.faceShape === shape
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                              }`}
                            >
                              <span className="capitalize text-sm">{shape}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Slider
                        label="Jawline Sharpness"
                        value={idealAvatarBuilder.face?.jawlineSharpness || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleFaceUpdate('jawlineSharpness', v)}
                      />
                      <Slider
                        label="Cheekbone Prominence"
                        value={idealAvatarBuilder.face?.cheekboneProminence || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleFaceUpdate('cheekboneProminence', v)}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Eye Shape
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['upturned', 'neutral', 'downturned'] as EyeShape[]).map(
                            (shape) => (
                              <button
                                key={shape}
                                onClick={() => handleFaceUpdate('eyeShape', shape)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  idealAvatarBuilder.face?.eyeShape === shape
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                                }`}
                              >
                                <span className="capitalize text-sm">{shape}</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <Slider
                        label="Nose Size"
                        value={idealAvatarBuilder.face?.noseSize || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleFaceUpdate('noseSize', v)}
                      />
                      <Slider
                        label="Lip Fullness"
                        value={idealAvatarBuilder.face?.lipFullness || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleFaceUpdate('lipFullness', v)}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'hair' && (
                    <motion.div
                      key="hair"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Hair Length
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['short', 'medium', 'long', 'very-long'] as HairLength[]).map(
                            (length) => (
                              <button
                                key={length}
                                onClick={() => handleHairUpdate('length', length)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  idealAvatarBuilder.hair?.length === length
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                                }`}
                              >
                                <span className="capitalize text-sm">
                                  {length.replace('-', ' ')}
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Hair Texture
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['straight', 'wavy', 'curly', 'coily'] as HairTexture[]).map(
                            (texture) => (
                              <button
                                key={texture}
                                onClick={() => handleHairUpdate('texture', texture)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  idealAvatarBuilder.hair?.texture === texture
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                                }`}
                              >
                                <span className="capitalize text-sm">{texture}</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <Slider
                        label="Facial Hair"
                        value={idealAvatarBuilder.hair?.facialHair || 0}
                        min={0}
                        max={100}
                        onChange={(v) => handleHairUpdate('facialHair', v)}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'style' && (
                    <motion.div
                      key="style"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                          Aesthetic Archetypes (multi-select)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            [
                              'athlete',
                              'academic',
                              'fashion-forward',
                              'creative',
                              'minimalist',
                            ] as AestheticArchetype[]
                          ).map((archetype) => (
                            <button
                              key={archetype}
                              onClick={() => toggleArchetype(archetype)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                idealAvatarBuilder.style?.archetypes?.includes(archetype)
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                              }`}
                            >
                              <span className="capitalize text-sm">
                                {archetype.replace('-', ' ')}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Slider
                        label="Clothing Style"
                        value={idealAvatarBuilder.style?.clothingStyle || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleStyleUpdate('clothingStyle', v)}
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Casual</span>
                        <span>Tailored</span>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'personality' && (
                    <motion.div
                      key="personality"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <p className="text-sm text-slate-400 mb-4">
                        These traits map to real-world attraction and can be inferred from behavior.
                      </p>
                      <PersonalitySlider
                        label="Energy"
                        leftLabel="Calm"
                        rightLabel="Intense"
                        value={idealAvatarBuilder.personality?.calmIntense || 50}
                        onChange={(v) => handlePersonalityUpdate('calmIntense', v)}
                      />
                      <PersonalitySlider
                        label="Vibe"
                        leftLabel="Playful"
                        rightLabel="Serious"
                        value={idealAvatarBuilder.personality?.playfulSerious || 50}
                        onChange={(v) => handlePersonalityUpdate('playfulSerious', v)}
                      />
                      <PersonalitySlider
                        label="Ambition"
                        leftLabel="Grounded"
                        rightLabel="Ambitious"
                        value={idealAvatarBuilder.personality?.groundedAmbitious || 50}
                        onChange={(v) => handlePersonalityUpdate('groundedAmbitious', v)}
                      />
                      <PersonalitySlider
                        label="Expression"
                        leftLabel="Reserved"
                        rightLabel="Expressive"
                        value={idealAvatarBuilder.personality?.reservedExpressive || 50}
                        onChange={(v) => handlePersonalityUpdate('reservedExpressive', v)}
                      />
                      <PersonalitySlider
                        label="Style"
                        leftLabel="Minimal"
                        rightLabel="Flashy"
                        value={idealAvatarBuilder.personality?.minimalFlashy || 50}
                        onChange={(v) => handlePersonalityUpdate('minimalFlashy', v)}
                      />
                      <PersonalitySlider
                        label="Relationship"
                        leftLabel="Casual / Hookup"
                        rightLabel="Long Term"
                        value={idealAvatarBuilder.personality?.casualLongterm || 50}
                        onChange={(v) => handlePersonalityUpdate('casualLongterm', v)}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'lifestyle' && (
                    <motion.div
                      key="lifestyle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-slate-400 mb-4">
                        Distribute 10 points across lifestyle categories. Weight what matters to you.
                      </p>
                      <LifestyleBlocks
                        preferences={
                          idealAvatarBuilder.lifestyle || {
                            active: 0,
                            nightlife: 0,
                            academic: 0,
                            creative: 0,
                            wellness: 0,
                          }
                        }
                        onChange={handleLifestyleUpdate}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button onClick={handleContinue} className="w-full game-button mt-4">
              Start Discovering Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

