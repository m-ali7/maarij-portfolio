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
      gsap.from('.timeline-line', {
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 1,
        },
        scaleY: 0,
        transformOrigin: 'top',
        ease: 'none',
      })

      gsap.from('.timeline-item', {
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 60%',
          end: 'bottom 60%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">My professional journey and the impact I&apos;ve made along the way.</p>

        <div className="timeline">
          <div className="timeline-line" />

          <div className="timeline__header">
            <Briefcase size={20} />
            <span>Work</span>
          </div>

          {profile.experience.map((item, i) => (
            <div
              key={i}
              className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}
            >
              <div className="timeline-item__dot" />
              <div className="timeline-item__card glass">
                <span className="timeline-item__period">{item.period}</span>
                <h3 className="timeline-item__role">{item.role}</h3>
                <p className="timeline-item__company">{item.company}</p>
                <p className="timeline-item__desc">{item.description}</p>
                <div className="timeline-item__tags">
                  {item.technologies.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="timeline__header timeline__header--edu">
            <GraduationCap size={20} />
            <span>Education</span>
          </div>

          {profile.education.map((item, i) => (
            <div
              key={i}
              className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}
            >
              <div className="timeline-item__dot timeline-item__dot--edu" />
              <div className="timeline-item__card glass">
                <span className="timeline-item__period">{item.period}</span>
                <h3 className="timeline-item__role">{item.degree}</h3>
                <p className="timeline-item__company">{item.school}</p>
                {item.description && (
                  <p className="timeline-item__desc">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
