import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useActiveSection } from '../hooks/useActiveSection'
import { profile } from '../data/profile'
import Logo from './Logo'

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="container navbar__inner">
        <button
          className="navbar__logo-btn"
          onClick={() => scrollTo('hero')}
          type="button"
          aria-label="Scroll to top"
        >
          <Logo />
        </button>

        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`navbar__link ${active === link.id ? 'navbar__link--active' : ''}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
              {active === link.id && (
                <motion.div
                  className="navbar__link-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm navbar__cv-btn"
          >
            Resume
          </a>
        </div>

        <button
          className="navbar__hamburger"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`navbar__mobile-link ${active === link.id ? 'navbar__mobile-link--active' : ''}`}
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary navbar__mobile-cv"
            >
              Download CV
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
