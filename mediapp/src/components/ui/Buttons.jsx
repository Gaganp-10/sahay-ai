import { motion } from 'framer-motion'
import { forwardRef } from 'react'

export const GradientButton = forwardRef(({ children, onClick, type = 'button', loading = false, className = '', style = {} }, ref) => (
  <motion.button
    ref={ref}
    type={type}
    onClick={onClick}
    whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
    whileTap={{ scale: 0.97 }}
    className={className}
    style={{
      background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      padding: '14px 36px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '16px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.8 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 4px 20px rgba(0,198,255,0.25)',
      transition: 'box-shadow 0.3s ease',
      ...style,
    }}
    disabled={loading}
  >
    {loading ? (
      <span className="spinner" style={{ width: 20, height: 20 }} />
    ) : children}
  </motion.button>
))
GradientButton.displayName = 'GradientButton'

export const OutlineButton = forwardRef(({ children, onClick, type = 'button', className = '', style = {} }, ref) => (
  <motion.button
    ref={ref}
    type={type}
    onClick={onClick}
    whileHover={{ backgroundColor: 'white', color: '#050B18' }}
    whileTap={{ scale: 0.97 }}
    className={className}
    style={{
      background: 'transparent',
      color: 'white',
      border: '2px solid rgba(255,255,255,0.7)',
      borderRadius: '50px',
      padding: '12px 36px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '16px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.25s ease',
      ...style,
    }}
  >
    {children}
  </motion.button>
))
OutlineButton.displayName = 'OutlineButton'
