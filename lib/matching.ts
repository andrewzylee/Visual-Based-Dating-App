import { User, Match, AvatarPreferences } from '@/types'

/**
 * Calculate cosine similarity between two avatar preference vectors
 * Returns a score between 0 and 1
 */
function calculateSimilarity(avatarA: AvatarPreferences, avatarB: AvatarPreferences): number {
  let score = 0
  let weight = 0

  // Body similarity
  const bodyWeight = 0.25
  const heightDiff = Math.abs(avatarA.body.height - avatarB.body.height)
  const heightScore = Math.max(0, 1 - heightDiff / 50) // 50cm tolerance
  score += heightScore * bodyWeight * 0.3
  weight += bodyWeight * 0.3

  const weightDiff = Math.abs(avatarA.body.weight - avatarB.body.weight)
  const weightScore = Math.max(0, 1 - weightDiff / 30) // 30kg tolerance
  score += weightScore * bodyWeight * 0.3
  weight += bodyWeight * 0.3

  const buildScore = avatarA.body.build === avatarB.body.build ? 1 : 0.5
  score += buildScore * bodyWeight * 0.2
  weight += bodyWeight * 0.2

  const shoulderDiff = Math.abs(avatarA.body.shoulderWidth - avatarB.body.shoulderWidth)
  const shoulderScore = Math.max(0, 1 - shoulderDiff / 100)
  score += shoulderScore * bodyWeight * 0.2
  weight += bodyWeight * 0.2

  // Face similarity
  const faceWeight = 0.3
  const faceShapeScore = avatarA.face.faceShape === avatarB.face.faceShape ? 1 : 0.3
  score += faceShapeScore * faceWeight * 0.2
  weight += faceWeight * 0.2

  const jawDiff = Math.abs(avatarA.face.jawlineSharpness - avatarB.face.jawlineSharpness)
  const jawScore = Math.max(0, 1 - jawDiff / 100)
  score += jawScore * faceWeight * 0.2
  weight += faceWeight * 0.2

  const cheekDiff = Math.abs(avatarA.face.cheekboneProminence - avatarB.face.cheekboneProminence)
  const cheekScore = Math.max(0, 1 - cheekDiff / 100)
  score += cheekScore * faceWeight * 0.2
  weight += faceWeight * 0.2

  const eyeShapeScore = avatarA.face.eyeShape === avatarB.face.eyeShape ? 1 : 0.5
  score += eyeShapeScore * faceWeight * 0.15
  weight += faceWeight * 0.15

  const noseDiff = Math.abs(avatarA.face.noseSize - avatarB.face.noseSize)
  const noseScore = Math.max(0, 1 - noseDiff / 100)
  score += noseScore * faceWeight * 0.15
  weight += faceWeight * 0.15

  const lipDiff = Math.abs(avatarA.face.lipFullness - avatarB.face.lipFullness)
  const lipScore = Math.max(0, 1 - lipDiff / 100)
  score += lipScore * faceWeight * 0.1
  weight += faceWeight * 0.1

  // Hair similarity
  const hairWeight = 0.15
  const hairLengthScore = avatarA.hair.length === avatarB.hair.length ? 1 : 0.5
  score += hairLengthScore * hairWeight * 0.4
  weight += hairWeight * 0.4

  const hairTextureScore = avatarA.hair.texture === avatarB.hair.texture ? 1 : 0.5
  score += hairTextureScore * hairWeight * 0.4
  weight += hairWeight * 0.4

  const facialHairDiff = Math.abs(avatarA.hair.facialHair - avatarB.hair.facialHair)
  const facialHairScore = Math.max(0, 1 - facialHairDiff / 100)
  score += facialHairScore * hairWeight * 0.2
  weight += hairWeight * 0.2

  // Style similarity
  const styleWeight = 0.2
  const commonArchetypes = avatarA.style.archetypes.filter((a) =>
    avatarB.style.archetypes.includes(a)
  )
  const archetypeScore =
    commonArchetypes.length / Math.max(1, Math.max(avatarA.style.archetypes.length, avatarB.style.archetypes.length))
  score += archetypeScore * styleWeight * 0.6
  weight += styleWeight * 0.6

  const clothingDiff = Math.abs(avatarA.style.clothingStyle - avatarB.style.clothingStyle)
  const clothingScore = Math.max(0, 1 - clothingDiff / 100)
  score += clothingScore * styleWeight * 0.4
  weight += styleWeight * 0.4

  // Presence similarity (less weight)
  const presenceWeight = 0.1
  const energyDiff = Math.abs(avatarA.presence.energyLevel - avatarB.presence.energyLevel)
  const energyScore = Math.max(0, 1 - energyDiff / 100)
  score += energyScore * presenceWeight * 0.5
  weight += presenceWeight * 0.5

  const expressionDiff = Math.abs(avatarA.presence.expressionBaseline - avatarB.presence.expressionBaseline)
  const expressionScore = Math.max(0, 1 - expressionDiff / 100)
  score += expressionScore * presenceWeight * 0.5
  weight += presenceWeight * 0.5

  // Personality similarity (if available)
  if (avatarA.personality && avatarB.personality) {
    const personalityWeight = 0.15
    const personalityTraits = [
      'calmIntense',
      'playfulSerious',
      'groundedAmbitious',
      'reservedExpressive',
      'minimalFlashy',
      'casualLongterm',
    ] as const

    personalityTraits.forEach((trait) => {
      const diff = Math.abs(
        avatarA.personality![trait] - avatarB.personality![trait]
      )
      const traitScore = Math.max(0, 1 - diff / 100)
      score += traitScore * personalityWeight * (1 / personalityTraits.length)
      weight += personalityWeight * (1 / personalityTraits.length)
    })
  }

  // Lifestyle similarity (if available)
  if (avatarA.lifestyle && avatarB.lifestyle) {
    const lifestyleWeight = 0.1
    const lifestyleCategories: Array<keyof typeof avatarA.lifestyle> = [
      'active',
      'nightlife',
      'academic',
      'creative',
      'wellness',
    ]

    // Calculate cosine similarity for lifestyle vectors
    let dotProduct = 0
    let normA = 0
    let normB = 0

    lifestyleCategories.forEach((category) => {
      const valA = avatarA.lifestyle![category] || 0
      const valB = avatarB.lifestyle![category] || 0
      dotProduct += valA * valB
      normA += valA * valA
      normB += valB * valB
    })

    const lifestyleScore =
      normA > 0 && normB > 0 ? dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) : 0.5
    score += lifestyleScore * lifestyleWeight
    weight += lifestyleWeight
  }

  // Normalize score
  return weight > 0 ? score / weight : 0.5
}

/**
 * Calculate mutual match score between two users
 * 
 * Score = similarity(Self_A, Ideal_B) × similarity(Self_B, Ideal_A)
 * 
 * This means:
 * - How much does User A's self avatar match User B's ideal avatar?
 * - How much does User B's self avatar match User A's ideal avatar?
 * - Mutual compatibility = both scores multiplied
 */
export function calculateMatchScore(userA: User, userB: User): Match {
  // How much User A's self avatar matches User B's ideal avatar
  const scoreA = calculateSimilarity(userA.selfAvatar, userB.idealAvatar)
  
  // How much User B's self avatar matches User A's ideal avatar
  const scoreB = calculateSimilarity(userB.selfAvatar, userA.idealAvatar)

  // Mutual compatibility score
  const mutualScore = scoreA * scoreB

  let compatibility: 'high' | 'medium' | 'low'
  if (mutualScore >= 0.7) {
    compatibility = 'high'
  } else if (mutualScore >= 0.4) {
    compatibility = 'medium'
  } else {
    compatibility = 'low'
  }

  return {
    userId: userB.id,
    score: scoreA, // How much A likes B
    mutualScore, // Mutual compatibility
    compatibility,
  }
}

/**
 * Rank users by match score
 */
export function rankMatches(currentUser: User, allUsers: User[]): Match[] {
  const matches = allUsers
    .filter((user) => user.id !== currentUser.id)
    .filter((user) => {
      // Filter by gender preferences
      return (
        currentUser.showTo.includes(user.gender) &&
        user.showTo.includes(currentUser.gender)
      )
    })
    .map((user) => calculateMatchScore(currentUser, user))

  // Sort by mutual score (descending)
  return matches.sort((a, b) => b.mutualScore - a.mutualScore)
}

/**
 * Get the single best match (Marriage Pact style)
 */
export function getBestMatch(currentUser: User, allUsers: User[]): Match | null {
  const matches = rankMatches(currentUser, allUsers)
  return matches.length > 0 ? matches[0] : null
}
