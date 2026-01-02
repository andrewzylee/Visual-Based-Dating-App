'use client'

interface PersonalitySliderProps {
  label: string
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (value: number) => void
}

export default function PersonalitySlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: PersonalitySliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-xs text-slate-400">{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, 
              rgb(37, 99, 235) 0%, 
              rgb(37, 99, 235) ${value}%, 
              rgb(236, 72, 153) ${value}%, 
              rgb(236, 72, 153) 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

