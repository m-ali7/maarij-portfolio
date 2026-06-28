import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { profile } from '../data/profile'

const FloatingShape = ({ className, style }: { className: string; style: React.CSSProperties }) => (
  <motion.div
    className={`floating-shape ${className}`}
    style={style}
    animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
)

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const },
    },
  }

  return (
    <section id="hero" className="hero grid-bg" ref={ref}>
      <FloatingShape
        className="shape-circle"
        style={{
          top: '15%',
          left: '10%',
          width: 80,
          height: 80,
          border: '2px solid var(--cyan-glow)',
          borderRadius: '50%',
        }}
      />
      <FloatingShape
        className="shape-dot-grid"
        style={{
          top: '25%',
          right: '12%',
          width: 60,
          height: 60,
          background:
            'radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />
      <FloatingShape
        className="shape-square"
        style={{
          bottom: '20%',
          left: '15%',
          width: 50,
          height: 50,
          border: '1.5px solid var(--accent-glow)',
          borderRadius: 8,
          transform: 'rotate(45deg)',
        }}
      />
      <FloatingShape
        className="shape-triangle"
        style={{
          top: '40%',
          right: '18%',
          width: 0,
          height: 0,
          borderLeft: '25px solid transparent',
          borderRight: '25px solid transparent',
          borderBottom: '45px solid rgba(6,182,212,0.15)',
          background: 'transparent',
          borderRadius: 0,
        }}
      />

      <div className="container">
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero__greeting" variants={itemVariants}>
            Hi, my name is
          </motion.p>

          <motion.h1 className="hero__name" variants={itemVariants}>
            {profile.name.split('').map((char, i) => (
              <motion.span
                key={i}
                className="hero__char"
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -90 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.25, 1, 0.5, 1] as const,
                      delay: 0.3 + i * 0.04,
                    },
                  },
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h2 className="hero__title" variants={itemVariants}>
            {profile.title}
          </motion.h2>

          <motion.p className="hero__tagline" variants={itemVariants}>
            {profile.tagline}
          </motion.p>

          <motion.div className="hero__ctas" variants={itemVariants}>
            <a
              href={profile.cvUrl}
              download
              className="btn btn-primary btn-lg"
              data-cursor-hover="true"
            >
              <Download size={18} />
              Download CV
            </a>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={scrollToContact}
              data-cursor-hover="true"
            >
              Get in Touch
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.div>

      <div className="hero__cv-note">
        <p>Place your CV PDF at <code>public/cv.pdf</code></p>
      </div>
    </section>
  )
}
