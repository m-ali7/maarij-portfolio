import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Brain, BarChart3, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'AI & Automation': Brain,
  'Business Analysis': BarChart3,
  'Tools & Technologies': Wrench,
}

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stack__heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.stack-panel', {
        scrollTrigger: { trigger: '.stack-grid', start: 'top 70%' },
        opacity: 0, y: 36, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="stack" className="stack" ref={sectionRef}>
      <div className="container">
        <h2 className="stack__heading">Stack & Tools</h2>
        <p className="stack__subtitle">
          Technologies, platforms and methodologies I use to design and build modern digital solutions.
        </p>

        <div className="stack-grid">
          {profile.stack.map((category) => {
            const Icon = CATEGORY_ICONS[category.category] || Brain
            return (
              <div key={category.category} className="stack-panel glass">
                <div className="stack-panel__header">
                  <div className="stack-panel__icon">
                    <Icon size={20} />
                  </div>
                  <h3>{category.category}</h3>
                </div>
                <div className="stack-panel__items">
                  {category.items.map((skill) => (
                    <span key={skill} className="stack-pill">
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
