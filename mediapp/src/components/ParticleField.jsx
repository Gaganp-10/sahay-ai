import { useMemo } from 'react'

export default function ParticleField({ count = 80 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 6,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  }, [count])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
