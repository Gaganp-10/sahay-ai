// Framer Motion animation variants

export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
}

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 }
  }
}

export const scaleIn = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const letterVariant = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export const cardHover = {
  rest: { y: 0, boxShadow: '0 0 0 rgba(0,198,255,0)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 60px rgba(0,198,255,0.2)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

export const overlayVariant = {
  initial: { scaleY: 1 },
  exit: {
    scaleY: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
  }
}
