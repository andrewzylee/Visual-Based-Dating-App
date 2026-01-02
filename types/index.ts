export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'

export type BodyBuild = 'slim' | 'athletic' | 'muscular' | 'stocky'
export type Posture = 'upright' | 'relaxed'
export type FaceShape = 'oval' | 'angular' | 'round' | 'square' | 'heart'
export type EyeShape = 'upturned' | 'neutral' | 'downturned'
export type HairLength = 'short' | 'medium' | 'long' | 'very-long'
export type HairTexture = 'straight' | 'wavy' | 'curly' | 'coily'
export type AestheticArchetype = 'athlete' | 'academic' | 'fashion-forward' | 'creative' | 'minimalist'

export interface BodyPreferences {
  height: number // cm
  weight: number // kg
  build: BodyBuild
  shoulderWidth: number // 0-100
  posture: Posture
}

export interface FacePreferences {
  faceShape: FaceShape
  jawlineSharpness: number // 0-100
  cheekboneProminence: number // 0-100
  eyeShape: EyeShape
  noseSize: number // 0-100
  lipFullness: number // 0-100
}

export interface HairPreferences {
  length: HairLength
  texture: HairTexture
  facialHair: number // 0-100 (if applicable)
}

export interface StylePreferences {
  archetypes: AestheticArchetype[]
  clothingStyle: number // 0-100 (casual -> tailored)
}

export interface PresencePreferences {
  energyLevel: number // 0-100 (calm -> intense)
  expressionBaseline: number // 0-100 (soft -> confident)
}

export interface PersonalityPreferences {
  calmIntense: number // 0-100 (calm -> intense)
  playfulSerious: number // 0-100 (playful -> serious)
  groundedAmbitious: number // 0-100 (grounded -> ambitious)
  reservedExpressive: number // 0-100 (reserved -> expressive)
  minimalFlashy: number // 0-100 (minimal -> flashy)
  casualLongterm: number // 0-100 (hookup/casual -> long term)
}

export type LifestyleCategory = 'active' | 'nightlife' | 'academic' | 'creative' | 'wellness'

export interface LifestylePreferences {
  active: number // 0-10
  nightlife: number // 0-10
  academic: number // 0-10
  creative: number // 0-10
  wellness: number // 0-10
  // Total must sum to 10
}

export interface AvatarPreferences {
  body: BodyPreferences
  face: FacePreferences
  hair: HairPreferences
  style: StylePreferences
  presence: PresencePreferences
  personality?: PersonalityPreferences
  lifestyle?: LifestylePreferences
}

// Alias for clarity
export type IdealTypePreferences = AvatarPreferences
export type SelfAvatarPreferences = AvatarPreferences

export interface User {
  id: string
  email: string
  phone?: string
  gender: Gender
  showTo: Gender[]
  photos: string[] // URLs
  selfAvatar: SelfAvatarPreferences // How I look
  idealAvatar: IdealTypePreferences // What I'm attracted to
  createdAt: Date
}

export interface Match {
  userId: string
  score: number
  mutualScore: number
  compatibility: 'high' | 'medium' | 'low'
}

