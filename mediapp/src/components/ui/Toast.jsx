import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const ICONS = { success: '✓', error: '✕', info: 'ℹ' }
const COLORS = {
  success: { bg: 'rgba(0,245,160,0.12)', border: '#00F5A0', icon: '#00F5A0' },
  error:   { bg: 'rgba(255,107,107,0.12)', border: '#FF6B6B', icon: '#FF6B6B' },
  info:    { bg: 'rgba(0,198,255,0.12)', border: '#00C6FF', icon: '#00C6FF' },
}

function ToastItem({ id, message, type = 'info', onRemove }) {
  const c = COLORS[type] || COLORS.info
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 3000)
    return () => clearTimeout(t)
  }, [id, onRemove])

  return (
    <motion.div
      layout
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '280px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <span style={{ color: c.icon, fontSize: '18px', fontWeight: 700 }}>{ICONS[type]}</span>
      <span style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '14px', flex: 1 }}>
        {message}
      </span>
      <button
        onClick={() => onRemove(id)}
        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}
      >✕</button>
    </motion.div>
  )
}

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook
import { useState, useCallback } from 'react'
export function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])
  return { toasts, addToast, removeToast }
}
