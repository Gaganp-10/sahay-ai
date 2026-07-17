import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 10000, suffix: '+', label: 'Active Users', prefix: '' },
  { value: 500, suffix: 'K+', label: 'Records Stored', prefix: '' },
  { value: 99.9, suffix: '%', label: 'Uptime', prefix: '', isFloat: true },
  { value: 256, suffix: '-bit', label: 'Encryption', prefix: '' },
]

function CountUp({ target, suffix, prefix, isFloat, started }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent((prev) => {
        const next = Math.min(prev + increment, target)
        return next
      })
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target])

  const display = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString()

  return (
    <span>
      {prefix}{display}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      style={{
        padding: '100px 20px',
        position: 'relative',
        background: 'linear-gradient(180deg, #050B18 0%, #080F20 100%)',
      }}
    >
      {/* Glow backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,198,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#00C6FF', letterSpacing: '0.15em', marginBottom: '12px' }}>
            BY THE NUMBERS
          </p>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              color: 'white',
            }}
          >
            Trusted at scale
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,198,255,0.12)' }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '40px 32px',
                textAlign: 'center',
                cursor: 'default',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 'clamp(42px, 6vw, 64px)',
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #00C6FF, #00F5A0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: '12px',
                }}
              >
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isFloat={stat.isFloat}
                  started={inView}
                />
              </div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: '#94A3B8',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
