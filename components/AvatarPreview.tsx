'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { IdealTypePreferences, HairLength, HairTexture } from '@/types'

interface AvatarPreviewProps {
  preferences: Partial<IdealTypePreferences>
}

// Create realistic skin material
function createSkinMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffdbac), // Skin tone
    roughness: 0.8,
    metalness: 0.1,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
  })
}

// Create hair material based on texture
function createHairMaterial(texture: HairTexture) {
  const colors: Record<HairTexture, number> = {
    straight: 0x4a3728,
    wavy: 0x5a4234,
    curly: 0x6a5244,
    coily: 0x7a6254,
  }

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors[texture]),
    roughness: 0.9,
    metalness: 0.05,
  })
}

// Create clothing material
function createClothingMaterial(style: number) {
  // Style affects color: casual (darker) to tailored (lighter)
  const brightness = 0.3 + (style / 100) * 0.3
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(brightness, brightness * 0.9, brightness * 0.8),
    roughness: 0.7,
    metalness: 0.1,
  })
}

// Hair component
function Hair({
  headScale,
  length,
  texture,
  facialHair,
  material,
}: {
  headScale: number
  length: HairLength
  texture: HairTexture
  facialHair: number
  material: THREE.Material
}) {
  const hairLengths: Record<HairLength, number> = {
    short: 0.05,
    medium: 0.12,
    long: 0.2,
    'very-long': 0.3,
  }

  const hairLengthValue = hairLengths[length]
  const segments = texture === 'straight' ? 8 : texture === 'wavy' ? 12 : 16

  // Use seeded random for consistent hair placement
  const seed = headScale * 1000
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  return (
    <group>
      {/* Main hair strands */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2
        const radius = headScale * (0.9 + random(i) * 0.1)
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = headScale * (0.3 + random(i + 100) * 0.4)
        const strandLength = hairLengthValue * (0.8 + random(i + 200) * 0.4)

        return (
          <mesh
            key={`hair-${i}`}
            position={[x, y, z]}
            rotation={[
              (random(i + 300) - 0.5) * 0.2,
              angle,
              (random(i + 400) - 0.5) * 0.2,
            ]}
            material={material}
          >
            <cylinderGeometry args={[headScale * 0.02, headScale * 0.015, strandLength, segments]} />
          </mesh>
        )
      })}

      {/* Facial hair */}
      {facialHair > 20 &&
        Array.from({ length: Math.floor((facialHair / 100) * 15) }).map((_, i) => {
          const angle = Math.PI / 2 + (random(i + 500) - 0.5) * 0.8
          const radius = headScale * 0.6
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = -headScale * 0.2 + random(i + 600) * 0.15
          const beardLength = headScale * 0.1 * (0.5 + random(i + 700) * 0.5)

          return (
            <mesh
              key={`beard-${i}`}
              position={[x, y, z]}
              rotation={[0, angle, 0]}
              material={material}
            >
              <cylinderGeometry args={[headScale * 0.015, headScale * 0.01, beardLength, 6]} />
            </mesh>
          )
        })}
    </group>
  )
}

function AvatarMesh({ preferences }: { preferences: Partial<IdealTypePreferences> }) {
  const meshRef = useRef<THREE.Group>(null)

  const { bodyData, faceData, hairData, styleData, materials } = useMemo(() => {
    const body = preferences.body
    const face = preferences.face
    const hair = preferences.hair
    const style = preferences.style
    if (!body) return { bodyData: null, faceData: null, hairData: null, styleData: null, materials: null }

    // Calculate body dimensions
    const height = (body.height || 175) / 100
    const weight = (body.weight || 70) / 10
    const shoulderWidth = (body.shoulderWidth || 50) / 100
    const build = body.build || 'athletic'

    // Body proportions
    let chestWidth = 0.4
    let waistWidth = 0.3
    let hipWidth = 0.35
    let armThickness = 0.08
    let legThickness = 0.1

    const weightFactor = 0.8 + (weight - 5) / 20

    switch (build) {
      case 'slim':
        chestWidth = 0.32 * weightFactor
        waistWidth = 0.26 * weightFactor
        hipWidth = 0.30 * weightFactor
        armThickness = 0.06 * weightFactor
        legThickness = 0.08 * weightFactor
        break
      case 'athletic':
        chestWidth = 0.38 * weightFactor
        waistWidth = 0.28 * weightFactor
        hipWidth = 0.33 * weightFactor
        armThickness = 0.08 * weightFactor
        legThickness = 0.10 * weightFactor
        break
      case 'muscular':
        chestWidth = 0.48 * weightFactor
        waistWidth = 0.30 * weightFactor
        hipWidth = 0.36 * weightFactor
        armThickness = 0.12 * weightFactor
        legThickness = 0.12 * weightFactor
        break
      case 'stocky':
        chestWidth = 0.46 * weightFactor
        waistWidth = 0.33 * weightFactor
        hipWidth = 0.38 * weightFactor
        armThickness = 0.10 * weightFactor
        legThickness = 0.11 * weightFactor
        break
    }

    const shoulderMultiplier = 0.8 + (shoulderWidth / 100) * 0.4
    chestWidth *= shoulderMultiplier

    // Face features
    const jawlineSharpness = (face?.jawlineSharpness || 50) / 100
    const cheekboneProminence = (face?.cheekboneProminence || 50) / 100
    const headScale = 0.15 + (cheekboneProminence - 0.5) * 0.05
    const noseSize = (face?.noseSize || 50) / 100
    const lipFullness = (face?.lipFullness || 50) / 100

    // Create materials
    const skinMat = createSkinMaterial()
    const clothingMat = createClothingMaterial(style?.clothingStyle || 50)

    return {
      bodyData: {
        height,
        chestWidth,
        waistWidth,
        hipWidth,
        shoulderWidth: chestWidth * (0.9 + shoulderWidth * 0.002),
        armThickness,
        legThickness,
        posture: body.posture === 'upright' ? 0 : -0.1,
      },
      faceData: {
        headScale,
        jawlineSharpness,
        cheekboneProminence,
        noseSize,
        lipFullness,
        eyeShape: face?.eyeShape || 'neutral',
        faceShape: face?.faceShape || 'oval',
      },
      hairData: {
        length: hair?.length || 'medium',
        texture: hair?.texture || 'wavy',
        facialHair: hair?.facialHair || 0,
      },
      styleData: {
        clothingStyle: style?.clothingStyle || 50,
      },
      materials: {
        skin: skinMat,
        clothing: clothingMat,
      },
    }
  }, [preferences])

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + Math.PI / 4
    }
  })

  const hairMaterial = useMemo(
    () => createHairMaterial(hairData?.texture || 'wavy'),
    [hairData?.texture]
  )

  if (!bodyData || !faceData || !hairData || !materials) return null

  const { height, chestWidth, waistWidth, hipWidth, shoulderWidth, armThickness, legThickness, posture } = bodyData
  const { headScale, jawlineSharpness, noseSize, lipFullness } = faceData
  const { skin, clothing } = materials

  return (
    <group ref={meshRef} position={[0, -height / 2, 0]} rotation={[posture, 0, 0]}>
      {/* Head with detailed face */}
      <group position={[0, height * 0.45, 0]}>
        {/* Main head */}
        <mesh material={skin}>
          <sphereGeometry args={[headScale, 32, 32]} />
        </mesh>

        {/* Jawline definition */}
        <mesh position={[0, -headScale * 0.25, headScale * 0.65]} material={skin}>
          <boxGeometry args={[headScale * (1.1 + jawlineSharpness * 0.1), headScale * 0.25, headScale * 0.15]} />
        </mesh>

        {/* Cheekbones */}
        <mesh position={[-headScale * 0.35, headScale * 0.15, headScale * 0.6]} material={skin}>
          <sphereGeometry args={[headScale * 0.12, 16, 16]} />
        </mesh>
        <mesh position={[headScale * 0.35, headScale * 0.15, headScale * 0.6]} material={skin}>
          <sphereGeometry args={[headScale * 0.12, 16, 16]} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-headScale * 0.25, headScale * 0.1, headScale * 0.7]}>
          <sphereGeometry args={[headScale * 0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[headScale * 0.25, headScale * 0.1, headScale * 0.7]}>
          <sphereGeometry args={[headScale * 0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Iris */}
        <mesh position={[-headScale * 0.25, headScale * 0.1, headScale * 0.75]}>
          <sphereGeometry args={[headScale * 0.05, 16, 16]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        <mesh position={[headScale * 0.25, headScale * 0.1, headScale * 0.75]}>
          <sphereGeometry args={[headScale * 0.05, 16, 16]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        {/* Pupil */}
        <mesh position={[-headScale * 0.25, headScale * 0.1, headScale * 0.78]}>
          <sphereGeometry args={[headScale * 0.03, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[headScale * 0.25, headScale * 0.1, headScale * 0.78]}>
          <sphereGeometry args={[headScale * 0.03, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, headScale * 0.05, headScale * 0.8]} material={skin}>
          <coneGeometry args={[headScale * 0.06 * (0.7 + noseSize * 0.6), headScale * 0.15, 8]} />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -headScale * 0.15, headScale * 0.7]}>
          <boxGeometry args={[headScale * 0.15, headScale * 0.03 * (0.5 + lipFullness), headScale * 0.05]} />
          <meshStandardMaterial color="#8b4a4a" />
        </mesh>

        {/* Hair */}
        <Hair
          headScale={headScale}
          length={hairData.length}
          texture={hairData.texture}
          facialHair={hairData.facialHair}
          material={hairMaterial}
        />
      </group>

      {/* Neck */}
      <mesh position={[0, height * 0.4, 0]} material={skin}>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 16]} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, height * 0.38, 0]} material={skin}>
        <boxGeometry args={[shoulderWidth, 0.08, chestWidth * 0.5]} />
      </mesh>

      {/* Torso with clothing */}
      <mesh position={[0, height * 0.28, 0]} material={clothing}>
        <boxGeometry args={[chestWidth, height * 0.25, chestWidth * 0.55]} />
      </mesh>

      {/* Waist */}
      <mesh position={[0, height * 0.12, 0]} material={clothing}>
        <boxGeometry args={[waistWidth, height * 0.12, waistWidth * 0.55]} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, height * 0.04, 0]} material={clothing}>
        <boxGeometry args={[hipWidth, height * 0.08, hipWidth * 0.55]} />
      </mesh>

      {/* Left Upper Arm */}
      <mesh
        position={[-shoulderWidth / 2 - armThickness / 2, height * 0.32, 0]}
        rotation={[0, 0, 0.4]}
        material={skin}
      >
        <cylinderGeometry args={[armThickness, armThickness * 1.1, height * 0.15, 16]} />
      </mesh>

      {/* Left Forearm */}
      <mesh
        position={[-shoulderWidth / 2 - armThickness, height * 0.22, 0]}
        rotation={[0, 0, 0.2]}
        material={skin}
      >
        <cylinderGeometry args={[armThickness * 0.9, armThickness * 0.85, height * 0.12, 16]} />
      </mesh>

      {/* Right Upper Arm */}
      <mesh
        position={[shoulderWidth / 2 + armThickness / 2, height * 0.32, 0]}
        rotation={[0, 0, -0.4]}
        material={skin}
      >
        <cylinderGeometry args={[armThickness, armThickness * 1.1, height * 0.15, 16]} />
      </mesh>

      {/* Right Forearm */}
      <mesh
        position={[shoulderWidth / 2 + armThickness, height * 0.22, 0]}
        rotation={[0, 0, -0.2]}
        material={skin}
      >
        <cylinderGeometry args={[armThickness * 0.9, armThickness * 0.85, height * 0.12, 16]} />
      </mesh>

      {/* Left Thigh */}
      <mesh position={[-hipWidth * 0.25, -height * 0.15, 0]} material={clothing}>
        <cylinderGeometry args={[legThickness, legThickness * 1.1, height * 0.20, 16]} />
      </mesh>

      {/* Left Calf */}
      <mesh position={[-hipWidth * 0.25, -height * 0.32, 0]} material={clothing}>
        <cylinderGeometry args={[legThickness * 0.85, legThickness * 0.8, height * 0.15, 16]} />
      </mesh>

      {/* Right Thigh */}
      <mesh position={[hipWidth * 0.25, -height * 0.15, 0]} material={clothing}>
        <cylinderGeometry args={[legThickness, legThickness * 1.1, height * 0.20, 16]} />
      </mesh>

      {/* Right Calf */}
      <mesh position={[hipWidth * 0.25, -height * 0.32, 0]} material={clothing}>
        <cylinderGeometry args={[legThickness * 0.85, legThickness * 0.8, height * 0.15, 16]} />
      </mesh>
    </group>
  )
}

function CameraSetup() {
  const { camera } = useThree()
  useMemo(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0.2, 2.2)
      camera.fov = 45
      camera.updateProjectionMatrix()
    }
  }, [camera])
  return null
}

export default function AvatarPreview({ preferences }: AvatarPreviewProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-purple-500/30 relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-lg text-xs text-slate-300">
        Drag to rotate • Scroll to zoom
      </div>
      <Canvas shadows camera={{ position: [0, 0.2, 2.2], fov: 45 }}>
        <CameraSetup />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.4} />
        <pointLight position={[0, -2, 3]} intensity={0.2} color="#fff8e1" />
        <AvatarMesh preferences={preferences} />
        <OrbitControls
          enablePan={false}
          minDistance={1.8}
          maxDistance={3.5}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI - Math.PI / 5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
