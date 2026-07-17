import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const [hidden, setHidden] = useState(false)
  const rafRef = useRef(null)
  const cursorPos = useRef({ x: -100, y: -100 })
  const targetPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY }
    }
    const onEnter = (e) => {
      if (e.target.closest('button, a, [data-cursor-hover]')) {
        setHovered(true)
      }
    }
    const onLeave = (e) => {
      if (e.target.closest('button, a, [data-cursor-hover]')) {
        setHovered(false)
      }
    }
    const onHide = () => setHidden(true)
    const onShow = () => setHidden(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    document.addEventListener('mouseleave', onHide)
    document.addEventListener('mouseenter', onShow)

    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, targetPos.current.x, 0.12)
      cursorPos.current.y = lerp(cursorPos.current.y, targetPos.current.y, 0.12)
      setPos({ x: cursorPos.current.x, y: cursorPos.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      document.removeEventListener('mouseleave', onHide)
      document.removeEventListener('mouseenter', onShow)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const size = hovered ? 50 : 16
  const borderColor = hovered ? '#00C6FF' : 'rgba(255,255,255,0.8)'

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        width: size,
        height: size,
        opacity: hidden ? 0 : 1,
        borderColor,
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left: pos.x - size / 2,
        top: pos.y - size / 2,
        borderRadius: '50%',
        border: '2px solid',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    />
  )
}
