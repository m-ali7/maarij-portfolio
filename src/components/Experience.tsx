import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Briefcase, GraduationCap } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exp__heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })

      gsap.from('.exp-group__line', {
        scrollTrigger: { trigger: '.exp-group', start: 'top 55%', end: 'bottom 50%', scrub: 1 },
        scaleY: 0, transformOrigin: 'top', ease: 'none',
      })

      gsap.from('.exp-card', {
        scrollTrigger: { trigger: '.exp-group', start: 'top 55%' },
        opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="experience" ref={sectionRef}>
      <div className="container">
        <h2 className="exp__heading">Experience</h2>

        <div className="exp-group">
          <div className="exp-group__header">
            <div className="exp-group__icon">
              <Briefcase size={18} />
            </div>
            <span>Work</span>
          </div>

          <div className="exp-group__body">
            <div className="exp-group__line" />

            {profile.experience.map((item, i) => (
              <div
                key={`work-${i}`}
                className={`exp-card ${i % 2 === 0 ? 'exp-card--left' : 'exp-card--right'}`}
              >
                <div className="exp-card__dot" />
                <div className="exp-card__inner glass">
                  <span className="exp-card__period">{item.period}</span>
                  <h3 className="exp-card__role">{item.role}</h3>
                  <p className="exp-card__company">{item.company}</p>
                  <p className="exp-card__desc">{item.description}</p>
                  <ul className="exp-card__bullets">
                    {item.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                  <div className="exp-card__tags">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="exp-group__header exp-group__header--edu">
              <div className="exp-group__icon exp-group__icon--edu">
                <GraduationCap size={18} />
              </div>
              <span>Education</span>
            </div>

            {profile.education.map((item, i) => (
              <div
                key={`edu-${i}`}
                className={`exp-card ${i % 2 === 0 ? 'exp-card--left' : 'exp-card--right'}`}
              >
                <div className="exp-card__dot exp-card__dot--edu" />
                <div className="exp-card__inner glass">
                  <span className="exp-card__period">{item.year}</span>
                  <h3 className="exp-card__role">{item.degree}</h3>
                  <p className="exp-card__company">{item.school}</p>
                  <p className="exp-card__desc">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
