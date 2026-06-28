import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Code2, Briefcase, AtSign, MapPin, Heart } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Code2 size={18} />,
  linkedin: <Briefcase size={18} />,
  twitter: <AtSign size={18} />,
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-subtitle">
          I&apos;m always open to new opportunities, collaborations, and interesting conversations.
        </p>

        <div className="contact__grid">
          <a
            href={`mailto:${profile.email}`}
            className="contact__item glass contact__item--email"
            data-cursor-hover="true"
          >
            <div className="contact__icon-wrapper">
              <Mail size={24} />
            </div>
            <h3>Email</h3>
            <p>{profile.email}</p>
            <span className="contact__cta">Send a message</span>
          </a>

          <div className="contact__item glass">
            <div className="contact__icon-wrapper">
              <MapPin size={24} />
            </div>
            <h3>Location</h3>
            <p>Available for remote work worldwide</p>
          </div>

          <div className="contact__socials glass contact__item">
            <h3>Find me on</h3>
            <div className="contact__social-links">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-link"
                  data-cursor-hover="true"
                  aria-label={social.label}
                >
                  {SOCIAL_ICONS[social.icon]}
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <p className="footer__text">
              Designed & Built by {profile.name}
            </p>
            <p className="footer__copy">
              <Heart size={14} /> {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}
