'use client'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-semibold text-purple-400">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-track slider-thumb w-full"
        style={{
          background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${
            ((value - min) / (max - min)) * 100
          }%, rgb(51, 65, 85) ${
            ((value - min) / (max - min)) * 100
          }%, rgb(51, 65, 85) 100%)`,
        }}
      />
    </div>
  )
}

