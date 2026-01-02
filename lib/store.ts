import { create } from 'zustand'
import { User, AvatarPreferences, Gender } from '@/types'

interface AppState {
  currentUser: User | null
  onboardingStep: number
  selfAvatarBuilder: Partial<AvatarPreferences>
  idealAvatarBuilder: Partial<AvatarPreferences>
  photos: string[]
  setCurrentUser: (user: User) => void
  setOnboardingStep: (step: number) => void
  setPhotos: (photos: string[]) => void
  updateSelfAvatar: (section: keyof AvatarPreferences, data: any) => void
  updateIdealAvatar: (section: keyof AvatarPreferences, data: any) => void
  resetSelfAvatar: () => void
  resetIdealAvatar: () => void
}

const defaultAvatar: Partial<AvatarPreferences> = {
  body: {
    height: 175,
    weight: 70,
    build: 'athletic',
    shoulderWidth: 50,
    posture: 'upright',
  },
  face: {
    faceShape: 'oval',
    jawlineSharpness: 50,
    cheekboneProminence: 50,
    eyeShape: 'neutral',
    noseSize: 50,
    lipFullness: 50,
  },
  hair: {
    length: 'medium',
    texture: 'wavy',
    facialHair: 0,
  },
  style: {
    archetypes: [],
    clothingStyle: 50,
  },
  presence: {
    energyLevel: 50,
    expressionBaseline: 50,
  },
  personality: {
    calmIntense: 50,
    playfulSerious: 50,
    groundedAmbitious: 50,
    reservedExpressive: 50,
    minimalFlashy: 50,
    casualLongterm: 50,
  },
  lifestyle: {
    active: 2,
    nightlife: 2,
    academic: 2,
    creative: 2,
    wellness: 2,
  },
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  onboardingStep: 0,
  selfAvatarBuilder: defaultAvatar,
  idealAvatarBuilder: defaultAvatar,
  photos: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setPhotos: (photos) => set({ photos }),
  updateSelfAvatar: (section, data) =>
    set((state) => ({
      selfAvatarBuilder: {
        ...state.selfAvatarBuilder,
        [section]: {
          ...state.selfAvatarBuilder[section],
          ...data,
        },
      },
    })),
  updateIdealAvatar: (section, data) =>
    set((state) => ({
      idealAvatarBuilder: {
        ...state.idealAvatarBuilder,
        [section]: {
          ...state.idealAvatarBuilder[section],
          ...data,
        },
      },
    })),
  resetSelfAvatar: () => set({ selfAvatarBuilder: defaultAvatar }),
  resetIdealAvatar: () => set({ idealAvatarBuilder: defaultAvatar }),
}))

