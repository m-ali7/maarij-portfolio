import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { useHeroSequence, TITLES } from '../hooks/useHeroSequence'
import HeroCanvasBackground from './hero/HeroCanvasBackground'

function HeroButton({
  href,
  onClick,
  variant,
  children,
}: {
  href?: string
  onClick?: () => void
  variant: 'primary' | 'outline'
  children: React.ReactNode
}) {
  const Component = href ? motion.a : motion.button
  const props = href
    ? { href, download: true, rel: undefined, target: undefined }
    : { type: 'button' as const, onClick }

  return (
    <Component
      {...props}
      className={`hero-btn hero-btn--${variant}`}
      data-cursor-hover="true"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="hero-btn__bg" />
      <span className="hero-btn__content">{children}</span>
    </Component>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const sequence = useHeroSequence()
  const [cycleIdx, setCycleIdx] = useState(0)

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (sequence.phase !== 'complete') return
    const interval = setInterval(() => {
      setCycleIdx((i) => (i + 1) % TITLES.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [sequence.phase])

  const showCTAs =
    sequence.phase === 'name-pause' ||
    sequence.titlesStarted ||
    sequence.phase === 'complete'

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <HeroCanvasBackground />

      <div className="hero__overlay" />

      <div className="container hero__container">
        <div className="hero__content">
          {/* Cursor blink */}
          <AnimatePresence>
            {sequence.phase === 'cursor-blink' && (
              <motion.div
                className="hero__blink-cursor"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          {/* Greeting */}
          <motion.p
            className="hero__greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: sequence.greetingText.length > 0 ? 1 : 0 }}
          >
            {sequence.greetingText}
            {sequence.phase === 'greeting' && (
              <span className="hero__cursor">|</span>
            )}
          </motion.p>

          {/* Name */}
          <motion.h1
            className="hero__name"
            initial={{ opacity: 0 }}
            animate={{ opacity: sequence.nameText.length > 0 ? 1 : 0 }}
          >
            <span className="hero__name-text">{sequence.nameText}</span>
            {(sequence.phase === 'name' || sequence.phase === 'name-pause') && (
              <span className="hero__cursor hero__cursor--name">|</span>
            )}
          </motion.h1>

          {/* Title */}
          <motion.div
            className="hero__title-wrapper"
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                sequence.phase === 'complete' ||
                sequence.titlesStarted
                  ? 1
                  : 0,
            }}
          >
            {sequence.phase !== 'complete' ? (
              <h2 className="hero__title">
                <span className="hero__title-text">
                  {sequence.currentTitle}
                </span>
                {(sequence.phase === 'titles-type' ||
                  sequence.phase === 'titles-delete') && (
                  <span className="hero__cursor">|</span>
                )}
              </h2>
            ) : (
              <AnimatePresence mode="wait">
                <motion.h2
                  key={cycleIdx}
                  className="hero__title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {TITLES[cycleIdx]}
                </motion.h2>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: sequence.taglineVisible ? 1 : 0,
              y: sequence.taglineVisible ? 0 : 20,
            }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] as const }}
          >
            {profile.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: showCTAs ? 1 : 0,
              y: showCTAs ? 0 : 20,
            }}
            transition={{
              duration: 0.7,
              ease: [0.25, 1, 0.5, 1] as const,
              delay: 0.15,
            }}
            style={{ pointerEvents: showCTAs ? 'auto' : 'none' }}
          >
            <HeroButton href={profile.cvUrl} variant="primary">
              <motion.span
                animate={showCTAs ? { x: [0, -2, 0] } : {}}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                style={{ display: 'inline-flex' }}
              >
                <Download size={17} />
              </motion.span>
              Download CV
            </HeroButton>
            <HeroButton onClick={scrollToContact} variant="outline">
              <motion.span
                animate={showCTAs ? { x: [0, -2, 0] } : {}}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3, delay: 0.3 }}
                style={{ display: 'inline-flex' }}
              >
                <Mail size={17} />
              </motion.span>
              Get in Touch
            </HeroButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: sequence.phase === 'complete' ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <span className="hero__scroll-text">Scroll to explore</span>
        <motion.div
          className="hero__scroll-line"
          animate={{ scaleY: [1, 1.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* CV note */}
      <div className="hero__cv-note">
        <p>
          Place your CV PDF at <code>public/cv.pdf</code>
        </p>
      </div>
    </section>
  )
}
