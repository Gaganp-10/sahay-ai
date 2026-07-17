import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    num: '01',
    icon: '🫀',
    title: 'Heart Rate Monitoring',
    desc: 'Real-time pulse tracking with intelligent anomaly detection and personalized insights.',
    accent: '#FF6B6B',
    bg: 'linear-gradient(135deg, #050B18 0%, #1a0010 100%)',
  },
  {
    num: '02',
    icon: '🧬',
    title: 'Medical Records Vault',
    desc: 'Securely store and access your complete health history, anywhere, anytime.',
    accent: '#00F5A0',
    bg: 'linear-gradient(135deg, #050B18 0%, #001a10 100%)',
  },
  {
    num: '03',
    icon: '📊',
    title: 'Health Analytics',
    desc: 'Beautiful charts and actionable insights powered by your personal health data.',
    accent: '#A78BFA',
    bg: 'linear-gradient(135deg, #050B18 0%, #0f001a 100%)',
  },
]

function HeartPulse({ color }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block', fontSize: '80px', filter: `drop-shadow(0 0 20px ${color})` }}
    >
      🫀
    </motion.div>
  )
}

function FeatureCard({ f, isActive }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 10%',
        background: f.bg,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div style={{ display: 'flex', gap: '80px', alignItems: 'center', maxWidth: 1200, width: '100%', flexWrap: 'wrap' }}>
        {/* Number */}
        <div
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 'clamp(80px, 15vw, 160px)',
            fontWeight: 500,
            color: f.accent,
            opacity: 0.15,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {f.num}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ marginBottom: '24px', fontSize: '64px' }}>
            {f.num === '01' ? <HeartPulse color={f.accent} /> : (
              <span style={{ fontSize: '64px', filter: `drop-shadow(0 0 16px ${f.accent})` }}>{f.icon}</span>
            )}
          </div>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '16px',
              lineHeight: 1.1,
            }}
          >
            {f.title}
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              color: '#94A3B8',
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            {f.desc}
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: i === parseInt(f.num) - 1 ? 32 : 8,
                  height: 4,
                  borderRadius: 4,
                  background: f.accent,
                  opacity: i === parseInt(f.num) - 1 ? 1 : 0.25,
                  transition: 'all 0.4s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturesScroll() {
  const stickyRef = useRef(null)
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const activeRef = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: stickyRef.current,
        scrub: 1,
        onUpdate: (self) => {
          const newActive = Math.min(2, Math.floor(self.progress * 3))
          if (newActive !== activeRef.current) {
            activeRef.current = newActive
            // Update visibility via opacity
            document.querySelectorAll('.feature-slide').forEach((el, i) => {
              el.style.opacity = i === newActive ? '1' : '0'
              el.style.pointerEvents = i === newActive ? 'auto' : 'none'
            })
          }
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`
          }
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
      <div
        ref={stickyRef}
        style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}
      >
        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 20 }}>
          <div ref={progressRef} style={{ height: '100%', background: 'linear-gradient(90deg, #00C6FF, #00F5A0)', width: '0%', transition: 'width 0.1s' }} />
        </div>

        {/* Feature slides */}
        {features.map((f, i) => (
          <div
            key={f.num}
            className="feature-slide"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 10%',
              background: f.bg,
              opacity: i === 0 ? 1 : 0,
              transition: 'opacity 0.6s ease',
              pointerEvents: i === 0 ? 'auto' : 'none',
            }}
          >
            <div style={{ display: 'flex', gap: '80px', alignItems: 'center', maxWidth: 1200, width: '100%', flexWrap: 'wrap' }}>
              <div
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 'clamp(80px, 15vw, 160px)',
                  fontWeight: 500,
                  color: f.accent,
                  opacity: 0.12,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {f.num}
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ marginBottom: '24px' }}>
                  {f.num === '01' ? (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ display: 'inline-block', fontSize: '64px', filter: `drop-shadow(0 0 20px ${f.accent})` }}
                    >
                      {f.icon}
                    </motion.span>
                  ) : (
                    <span style={{ fontSize: '64px', filter: `drop-shadow(0 0 16px ${f.accent})` }}>{f.icon}</span>
                  )}
                </div>
                <h2
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '16px',
                    lineHeight: 1.1,
                  }}
                >
                  {f.title}
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#94A3B8', lineHeight: 1.7, maxWidth: 480 }}>
                  {f.desc}
                </p>
                {/* Indicator dots */}
                <div style={{ marginTop: '40px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {features.map((_, di) => (
                    <div
                      key={di}
                      style={{
                        width: di === i ? 36 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: di === i ? f.accent : 'rgba(255,255,255,0.15)',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
