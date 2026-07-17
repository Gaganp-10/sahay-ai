import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onComplete, 800)
    }, 1800)
    return () => clearTimeout(timer)
  }, [onComplete])

  // ECG path
  const ecgPath = "M0,50 L60,50 L80,10 L100,90 L120,10 L140,90 L160,50 L220,50"

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050B18',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center' }}
          >
            <motion.h1
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '3.5rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00C6FF, #00F5A0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.1em',
              }}
            >
              MediApp
            </motion.h1>
            <p style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', marginTop: '8px' }}>
              Your Health. Visualized.
            </p>
          </motion.div>

          {/* ECG Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg width="220" height="100" viewBox="0 0 220 100">
              <motion.path
                d={ecgPath}
                stroke="#00F5A0"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
              />
              {/* Dot following path */}
              <motion.circle
                r="4"
                fill="#00F5A0"
                filter="url(#glow)"
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                style={{ offsetPath: `path("${ecgPath}")` }}
                transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
              />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            style={{ display: 'flex', gap: '8px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C6FF', display: 'block' }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
