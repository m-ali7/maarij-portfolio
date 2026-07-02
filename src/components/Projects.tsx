import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FolderGit2, Clock } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRefs = useRef<Map<number, HTMLImageElement>>(new Map())

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.proj__heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.proj-card', {
        scrollTrigger: { trigger: '.proj-grid', start: 'top 65%' },
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (isTouchDevice()) return
      const img = imgRefs.current.get(index)
      if (!img) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4
      img.style.transform = `scale(1.03) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    },
    [],
  )

  const handleMouseLeave = useCallback((index: number) => {
    const img = imgRefs.current.get(index)
    if (!img) return
    img.style.transform = ''
  }, [])

  return (
    <section id="projects" className="projects" ref={sectionRef}>
      <div className="container">
        <h2 className="proj__heading">Projects</h2>

        <div className="proj-grid">
          {profile.projects.map((project, i) => {
            const isComingSoon = project.status === 'coming-soon'

            return (
              <div
                key={i}
                className="proj-card glass"
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                <div className="proj-card__image">
                  {project.image ? (
                    <img
                      ref={(el) => {
                        if (el) imgRefs.current.set(i, el)
                        else imgRefs.current.delete(i)
                      }}
                      src={project.image}
                      alt={project.title}
                      className="proj-card__img"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`proj-card__img-placeholder${isComingSoon ? ' proj-card__img-placeholder--soon' : ''}`}>
                      <span>{project.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="proj-card__body">
                  <span className="proj-card__type">{project.type}</span>
                  <h3 className="proj-card__title">{project.title}</h3>
                  <p className="proj-card__desc">{project.description}</p>
                  <div className="proj-card__tags">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                  {isComingSoon ? (
                    <span className="proj-card__gh-link proj-card__gh-link--soon">
                      <Clock size={15} />
                      Coming Soon
                    </span>
                  ) : (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-card__gh-link"
                      data-cursor-hover="true"
                    >
                      <FolderGit2 size={15} />
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
