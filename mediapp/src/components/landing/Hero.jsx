import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ParticleField from '../ParticleField'

const letterVariant = {
  hidden: { opacity: 0, y: 80 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const title = 'MEDIAPP'

export default function Hero() {
  const navigate = useNavigate()
  const ecgRef = useRef(null)

  useEffect(() => {
    if (!ecgRef.current) return
    const path = ecgRef.current
    const length = path.getTotalLength()
    path.style.strokeDasharray = length
    path.style.strokeDashoffset = length
    path.style.animation = 'ecgHero 3s linear infinite'
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0072FF22 0%, #050B18 70%)',
      }}
    >
      <ParticleField count={80} />

      {/* ECG background */}
      <svg
        style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', opacity: 0.15, width: '100%' }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          ref={ecgRef}
          d="M0,100 L200,100 L250,40 L300,160 L350,20 L400,180 L450,40 L500,100 L700,100 L750,40 L800,160 L850,20 L900,180 L950,40 L1000,100 L1200,100 L1250,40 L1300,160 L1350,100 L1440,100"
          fill="none"
          stroke="#00F5A0"
          strokeWidth="2"
        />
      </svg>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px' }}>
        {/* Letter-by-letter title */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 'clamp(56px, 12vw, 120px)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            letterSpacing: '0.05em',
            marginBottom: '20px',
          }}
        >
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariant}
              initial="hidden"
              animate="visible"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #00C6FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{
            fontSize: 'clamp(18px, 3vw, 26px)',
            fontFamily: 'Inter, sans-serif',
            color: '#94A3B8',
            marginBottom: '8px',
          }}
        >
          Your Health. Visualized.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            fontSize: '16px',
            fontFamily: 'DM Mono, monospace',
            color: '#00F5A0',
            marginBottom: '48px',
            letterSpacing: '0.08em',
          }}
        >
          Track. Understand. Thrive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,198,255,0.45)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 44px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '17px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,198,255,0.3)',
            }}
          >
            Get Started →
          </motion.button>
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ backgroundColor: 'white', color: '#050B18' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '50px',
              padding: '16px 44px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '17px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: '#94A3B8',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.1em',
        }}
      >
        <span>SCROLL</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path d="M8 0v20M1 13l7 7 7-7" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <style>{`
        @keyframes ecgHero {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  )
}
