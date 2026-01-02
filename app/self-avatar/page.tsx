'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import AvatarPreview from '@/components/AvatarPreview'
import Slider from '@/components/Slider'
import { Upload, X } from 'lucide-react'
import {
  BodyBuild,
  Posture,
  FaceShape,
  EyeShape,
  HairLength,
  HairTexture,
  AestheticArchetype,
} from '@/types'

const SECTIONS = ['photos', 'body', 'face', 'hair', 'style'] as const
type Section = (typeof SECTIONS)[number]

export default function SelfAvatarPage() {
  const router = useRouter()
  const { selfAvatarBuilder, updateSelfAvatar, photos, setPhotos } = useStore()
  const [activeSection, setActiveSection] = useState<Section>('photos')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file: File) => {
      if (photos.length >= 6) return
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotos([...photos, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i: number) => i !== index))
  }

  const handleBodyUpdate = (key: string, value: any) => {
    updateSelfAvatar('body', { [key]: value })
  }

  const handleFaceUpdate = (key: string, value: any) => {
    updateSelfAvatar('face', { [key]: value })
  }

  const handleHairUpdate = (key: string, value: any) => {
    updateSelfAvatar('hair', { [key]: value })
  }

  const handleStyleUpdate = (key: string, value: any) => {
    updateSelfAvatar('style', { [key]: value })
  }

  const toggleArchetype = (archetype: AestheticArchetype) => {
    const current = selfAvatarBuilder.style?.archetypes || []
    const updated = current.includes(archetype)
      ? current.filter((a) => a !== archetype)
      : [...current, archetype]
    handleStyleUpdate('archetypes', updated)
  }

  const handleContinue = () => {
    if (photos.length >= 3) {
      router.push('/ideal-avatar')
    } else {
      alert('Please upload at least 3 photos to continue')
    }
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create Your Self Avatar
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Upload photos and adjust to show how you look. This helps others see if you match their ideal type.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Preview */}
          <div className="lg:col-span-2">
            <div className="game-card h-[600px]">
              <AvatarPreview preferences={selfAvatarBuilder} />
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      activeSection === section
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-6">
                <AnimatePresence mode="wait">
                  {activeSection === 'photos' && (
                    <motion.div
                      key="photos"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-slate-400 mb-4">
                        Upload 3-6 photos. The system will analyze them to create your avatar.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <div
                            key={index}
                            className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/50 flex items-center justify-center relative overflow-hidden"
                          >
                            {photos[index] ? (
                              <>
                                <img
                                  src={photos[index]}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center text-slate-500">
                                <Upload className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-xs">Photo {index + 1}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={photos.length >= 6}
                        className="w-full px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {photos.length >= 6 ? 'Maximum 6 photos' : 'Add Photos'}
                      </button>
                    </motion.div>
                  )}

                  {activeSection === 'body' && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-slate-400 mb-4">
                        Adjust these based on your actual appearance.
                      </p>
                      <Slider
                        label="Height"
                        value={selfAvatarBuilder.body?.height || 175}
                        min={150}
                        max={200}
                        unit="cm"
                        onChange={(v) => handleBodyUpdate('height', v)}
                      />
                      <Slider
                        label="Weight"
                        value={selfAvatarBuilder.body?.weight || 70}
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
                                  selfAvatarBuilder.body?.build === build
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
                        value={selfAvatarBuilder.body?.shoulderWidth || 50}
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
                                selfAvatarBuilder.body?.posture === posture
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
                      <p className="text-sm text-slate-400 mb-4">
                        Refine your facial features based on your photos.
                      </p>
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
                                selfAvatarBuilder.face?.faceShape === shape
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
                        value={selfAvatarBuilder.face?.jawlineSharpness || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleFaceUpdate('jawlineSharpness', v)}
                      />
                      <Slider
                        label="Cheekbone Prominence"
                        value={selfAvatarBuilder.face?.cheekboneProminence || 50}
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
                                  selfAvatarBuilder.face?.eyeShape === shape
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
                        value={selfAvatarBuilder.face?.noseSize || 50}
                        min={0}
                        max={100}
                        onChange={(v) => handleFaceUpdate('noseSize', v)}
                      />
                      <Slider
                        label="Lip Fullness"
                        value={selfAvatarBuilder.face?.lipFullness || 50}
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
                                  selfAvatarBuilder.hair?.length === length
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
                                  selfAvatarBuilder.hair?.texture === texture
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
                        value={selfAvatarBuilder.hair?.facialHair || 0}
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
                                selfAvatarBuilder.style?.archetypes?.includes(archetype)
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
                        value={selfAvatarBuilder.style?.clothingStyle || 50}
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
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={photos.length < 3}
              className="w-full game-button mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Ideal Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

