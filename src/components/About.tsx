import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Trophy } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about__text p', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })

      gsap.from('.achievement-item', {
        scrollTrigger: {
          trigger: '.about__achievements',
          start: 'top 80%',
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">A brief introduction to who I am and what drives me.</p>

        <div className="about__grid">
          <div className="about__text">
            {profile.about.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="about__achievements">
            <h3>
              <Trophy size={20} />
              Highlights
            </h3>
            <ul>
              {profile.achievements.map((achievement, i) => (
                <li key={i} className="achievement-item">
                  <span className="achievement-dot" />
                  {achievement}
                </li>
              ))}
            </ul>

            <div className="about__languages">
              <h3>Languages</h3>
              <div className="language-tags">
                {profile.languages.map((lang, i) => (
                  <span key={i} className="tag">{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
