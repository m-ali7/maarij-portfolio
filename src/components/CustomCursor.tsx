import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isTouch] = useState(
    () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  )
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ref = useRef<HTMLDivElement>(null)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (isTouch) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('data-cursor-hover') === 'true'
      ) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('data-cursor-hover') === 'true'
      ) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [cursorX, cursorY, isTouch])

  if (isTouch) return null

  return (
    <motion.div
      ref={ref}
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    >
      <motion.div
        className="cursor-dot"
        style={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          translateX: '-50%',
          translateY: '-50%',
          x: springX,
          y: springY,
        }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
        }}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          translateX: '-50%',
          translateY: '-50%',
          x: springX,
          y: springY,
          transition: 'width 0.2s, height 0.2s',
        }}
      />
    </motion.div>
  )
}
