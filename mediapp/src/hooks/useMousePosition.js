import { useState, useEffect } from 'react'

export default function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e) => {
      if (
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('[data-cursor-hover]') ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A'
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return { position, isHovering }
}
