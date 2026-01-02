# Visual Compatibility Matching Platform

A dating/matching app where users design their ideal partner visually using a game-style avatar builder (NBA 2K / GTA MyPlayer–like). The system uses visual preference vectors to match users based on predicted mutual attraction, similar to Marriage Pact's single-match approach.

## Features

- **Dual Avatar System**:
  - **Self Avatar**: How you look (from photos + manual adjustments)
  - **Ideal Avatar**: What you're attracted to (game-style builder)

- **Game-like 3D Avatar Builder**: Real-time 3D preview with realistic human features (skin, hair, facial details)

- **Personality Sliders**: Aesthetic continuous sliders for:
  - Calm ←→ Intense
  - Playful ←→ Serious
  - Grounded ←→ Ambitious
  - Reserved ←→ Expressive
  - Minimal ←→ Flashy
  - Casual/Hookup ←→ Long Term

- **Lifestyle Blocks**: Weighted distribution system (10 points total across 5 categories):
  - Active Lifestyle
  - Nightlife / Social
  - Academics / Career Focus
  - Creative Pursuits
  - Wellness / Health

- **Single Match System**: Marriage Pact-style matching - get one most compatible partner

- **Mutual Attraction Scoring**: 
  - Score = similarity(Self_A, Ideal_B) × similarity(Self_B, Ideal_A)
  - Continuous scores, not binary filters

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Three.js / React Three Fiber** - 3D avatar preview
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Zustand** - State management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages
  - `/onboarding` - Sign up flow
  - `/self-avatar` - Create your self avatar (photos + adjustments)
  - `/ideal-avatar` - Build your ideal match (game-style builder)
  - `/discover` - View your single match
  - `/matches` - Chat with your match
- `/components` - Reusable React components
  - `AvatarPreview` - 3D character preview
  - `PersonalitySlider` - Aesthetic personality sliders
  - `LifestyleBlocks` - Weighted lifestyle distribution
- `/lib` - Utilities and business logic
  - `matching.ts` - Matching algorithm
  - `store.ts` - Zustand state management
- `/types` - TypeScript type definitions

## User Flow

1. **Onboarding** - Sign up, select gender, accept disclaimer
2. **Self Avatar Creation** - Upload photos and adjust to show how you look
3. **Ideal Avatar Creation** - Build your ideal match using game-style sliders
4. **Match Reveal** - View your single most compatible match (Marriage Pact style)
5. **Chat** - Start a conversation with your match

## Matching Algorithm

The matching system uses mutual compatibility:

- **How similar is User A's Self Avatar to User B's Ideal Avatar?**
- **How similar is User B's Self Avatar to User A's Ideal Avatar?**
- **Mutual Score = (A matches B's ideal) × (B matches A's ideal)**

The algorithm considers:
- Body proportions (height, weight, build, shoulder width)
- Facial features (shape, jawline, cheekbones, eyes, nose, lips)
- Hair & grooming preferences
- Style & aesthetic archetypes
- Personality traits (6 dimensions)
- Lifestyle preferences (weighted distribution)

Scores are continuous (0-1), and the system returns the single best match based on highest mutual compatibility.

## License

MIT
