import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Briefcase, Target, Globe } from 'lucide-react'
import { profile } from '../data/profile'
import AboutCanvas from './hero/AboutCanvas'

gsap.registerPlugin(ScrollTrigger)

const floatConfigs = [
  { y: [0, -4, 0], duration: 4.2, delay: 0 },
  { y: [0, -3, 0], duration: 4.8, delay: 0.6 },
  { y: [0, -5, 0], duration: 5.1, delay: 1.3 },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about__heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.about__text p', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 62%' },
        opacity: 0, y: 24, duration: 0.8, stagger: 0.22, ease: 'power3.out',
      })
      gsap.from('.about-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.18, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__visual-bg">
        <AboutCanvas />
        <div className="about__visual-overlay" />
      </div>

      <div className="container about__container">
        <div className="about__grid">
          <div className="about__left">
            <h2 className="about__heading">About</h2>
            <div className="about__text">
              {profile.about.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="about__right" />
        </div>

        <div className="about__cards-area">
          <motion.div
            className="about-card about-card--currently glass"
            animate={floatConfigs[0]}
            transition={{
              duration: floatConfigs[0].duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: floatConfigs[0].delay,
            }}
          >
            <div className="about-card__icon">
              <Briefcase size={18} />
            </div>
            <h3 className="about-card__title">Currently</h3>
            <p className="about-card__role">{profile.currently.role}</p>
            <p className="about-card__company">{profile.currently.company}</p>
            <p className="about-card__desc">{profile.currently.description}</p>
          </motion.div>

          <motion.div
            className="about-card about-card--focus glass"
            animate={floatConfigs[1]}
            transition={{
              duration: floatConfigs[1].duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: floatConfigs[1].delay,
            }}
          >
            <div className="about-card__icon">
              <Target size={18} />
            </div>
            <h3 className="about-card__title">Current Focus</h3>
            <ul className="about-card__list">
              {profile.currentFocus.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="about-card about-card--languages glass"
            animate={floatConfigs[2]}
            transition={{
              duration: floatConfigs[2].duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: floatConfigs[2].delay,
            }}
          >
            <div className="about-card__icon">
              <Globe size={16} />
            </div>
            <h3 className="about-card__title">Languages</h3>
            <div className="about__lang-items">
              {profile.languages.map((lang, i) => (
                <span key={i} className="about__lang-pill">{lang}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
