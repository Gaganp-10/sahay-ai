import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section
      style={{
        position: 'relative',
        padding: '140px 20px',
        overflow: 'hidden',
        background: '#050B18',
        textAlign: 'center',
      }}
    >
      {/* Radial burst */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '80vw',
          height: '80vw',
          maxWidth: 800,
          maxHeight: 800,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,198,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated ring */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '50vw',
          height: '50vw',
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: '50%',
          border: '1px solid rgba(0,198,255,0.15)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#00C6FF', letterSpacing: '0.2em', marginBottom: '24px' }}
        >
          BEGIN TODAY
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(40px, 8vw, 100px)',
            fontWeight: 800,
            lineHeight: 1.0,
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #00C6FF 50%, #00F5A0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          START YOUR
          <br />
          HEALTH JOURNEY
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#94A3B8', marginBottom: '48px', maxWidth: 520, margin: '0 auto 48px' }}
        >
          Join thousands who trust MediApp to monitor their health, track their progress, and live better every day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05, boxShadow: '0 16px 60px rgba(0,198,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '20px 56px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,198,255,0.35)',
              letterSpacing: '0.02em',
            }}
          >
            Create Free Account →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
