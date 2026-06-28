import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Monitor, Server, Database, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frontend: Monitor,
  Backend: Server,
  Databases: Database,
  'DevOps & Tools': Wrench,
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-category', {
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 70%',
          end: 'bottom 60%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Skills & Tools</h2>
        <p className="section-subtitle">Technologies I work with on a daily basis.</p>

        <div className="skills-grid">
          {profile.skills.map((category) => {
            const Icon = CATEGORY_ICONS[category.category] || Code2
            return (
              <div key={category.category} className="skills-category glass">
                <div className="skills-category__header">
                  <Icon size={20} />
                  <h3>{category.category}</h3>
                </div>
                <div className="skills-category__items">
                  {category.items.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
