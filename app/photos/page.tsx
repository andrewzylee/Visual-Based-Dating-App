'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'

export default function PhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file: File) => {
      if (photos.length >= 6) return
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotos((prev: string[]) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removePhoto = (index: number) => {
    setPhotos((prev: string[]) => prev.filter((_, i: number) => i !== index))
  }

  const handleContinue = () => {
    if (photos.length >= 3) {
      // In a real app, upload photos to server here
      router.push('/discover')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="game-card max-w-4xl w-full"
      >
        <h2 className="text-3xl font-bold mb-2">Upload Your Photos</h2>
        <p className="text-slate-400 mb-6">
          Add 3-6 photos of yourself. These help others see your visual style.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Photo {index + 1}</span>
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

        <div className="flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= 6}
            className="flex-1 px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {photos.length >= 6 ? 'Maximum 6 photos' : 'Add Photos'}
          </button>
          <button
            onClick={handleContinue}
            disabled={photos.length < 3}
            className="flex-1 game-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Discover
          </button>
        </div>
      </motion.div>
    </div>
  )
}

