import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, MapPin, Globe, Send, Heart } from 'lucide-react'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.contact-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="container">
        <h2 className="contact__heading">Get in Touch</h2>
        <p className="contact__subtitle">
          Interested in AI, automation, business analysis or digital transformation? Let&apos;s connect.
        </p>

        <div className="contact__grid">
          <a
            href={`mailto:${profile.email}`}
            className="contact-card glass"
            data-cursor-hover="true"
          >
            <div className="contact-card__icon">
              <Mail size={22} />
            </div>
            <h3>Email</h3>
            <p>{profile.email}</p>
            <span className="contact-card__action">Send a message</span>
          </a>

          <div className="contact-card glass">
            <div className="contact-card__icon">
              <MapPin size={22} />
            </div>
            <h3>Location</h3>
            <p>London, United Kingdom</p>
          </div>

          <a
            href="https://www.linkedin.com/in/maarij-ali-76b15019a"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card glass"
            data-cursor-hover="true"
          >
            <div className="contact-card__icon">
              <Globe size={22} />
            </div>
            <h3>LinkedIn</h3>
            <p>linkedin.com/in/maarij-ali</p>
            <span className="contact-card__action">View Profile</span>
          </a>
        </div>

        <div className="contact__cta">
          <a
            href={`mailto:${profile.email}`}
            className="contact__cta-btn"
            data-cursor-hover="true"
          >
            <Send size={17} />
            Send Email
          </a>
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
