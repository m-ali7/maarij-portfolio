import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FolderGit2 } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section id="projects" className="projects" ref={sectionRef}>
      <div className="container">
        <h2 className="proj__heading">Projects</h2>

        <div className="proj-grid">
          {profile.projects.map((project, i) => (
            <div key={i} className="proj-card glass">
              <div className="proj-card__image">
                <div className="proj-card__img-placeholder">
                  <span>{project.title.charAt(0)}</span>
                </div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
