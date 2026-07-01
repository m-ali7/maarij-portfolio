import { useEffect, useRef, useCallback } from 'react'

interface Star {
  x: number; y: number
  size: number; alpha: number
  speed: number; phase: number
  hue: number
}

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; baseSize: number
  hue: number; alpha: number; baseAlpha: number
  phase: number
}

interface NebulaBlob {
  x: number; y: number
  radius: number; hue: number; alpha: number
  speedX: number; speedY: number
  phase: number
}

const STAR_COUNT = 180
const PARTICLE_COUNT = 90
const STAR_HUES = [215, 200, 270, 310, 230, 290, 195, 260, 320, 240, 330]
const PARTICLE_HUES = [210, 195, 270, 320, 290, 310, 200, 240, 330, 280, 220, 305]

const NEBULA_BLOBS: Omit<NebulaBlob, 'phase'>[] = [
  { x: 0.20, y: 0.15, radius: 0.55, hue: 275, alpha: 0.10, speedX: 0.00008, speedY: 0.00012 },
  { x: 0.75, y: 0.25, radius: 0.48, hue: 200, alpha: 0.09, speedX: -0.0001, speedY: 0.00008 },
  { x: 0.50, y: 0.45, radius: 0.60, hue: 320, alpha: 0.08, speedX: 0.00006, speedY: -0.0001 },
  { x: 0.30, y: 0.65, radius: 0.50, hue: 195, alpha: 0.08, speedX: 0.00012, speedY: 0.00006 },
  { x: 0.65, y: 0.70, radius: 0.45, hue: 290, alpha: 0.07, speedX: -0.00009, speedY: -0.00012 },
  { x: 0.85, y: 0.55, radius: 0.52, hue: 250, alpha: 0.08, speedX: -0.00007, speedY: 0.0001 },
  { x: 0.12, y: 0.40, radius: 0.42, hue: 210, alpha: 0.07, speedX: 0.0001, speedY: -0.00008 },
  { x: 0.55, y: 0.85, radius: 0.48, hue: 335, alpha: 0.06, speedX: 0.00005, speedY: -0.00006 },
]

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const dimsRef = useRef({ w: 0, h: 0 })
  const objectsRef = useRef<{ stars: Star[]; particles: Particle[]; blobs: NebulaBlob[] }>({
    stars: [], particles: [], blobs: [],
  })

  const init = useCallback((w: number, h: number) => {
    dimsRef.current = { w, h }

    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        size: Math.random() * 1.8 + 0.2,
        alpha: Math.random() * 0.65 + 0.1,
        speed: Math.random() * 0.018 + 0.003,
        phase: Math.random() * Math.PI * 2,
        hue: STAR_HUES[Math.floor(Math.random() * STAR_HUES.length)],
      })
    }
    objectsRef.current.stars = stars

    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2.2 + 0.5,
        baseSize: Math.random() * 2.2 + 0.5,
        hue: PARTICLE_HUES[Math.floor(Math.random() * PARTICLE_HUES.length)],
        alpha: Math.random() * 0.35 + 0.06,
        baseAlpha: Math.random() * 0.35 + 0.06,
        phase: Math.random() * Math.PI * 2,
      })
    }
    objectsRef.current.particles = particles

    objectsRef.current.blobs = NEBULA_BLOBS.map((c) => ({
      ...c, phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init(window.innerWidth, window.innerHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = (ts: number) => {
      const { w, h } = dimsRef.current
      const time = ts * 0.001
      const { stars, particles, blobs } = objectsRef.current

      ctx.clearRect(0, 0, w, h)

      for (const b of blobs) {
        const bx = w * b.x + Math.sin(time * b.speedX * 45 + b.phase) * 45
        const by = h * b.y + Math.cos(time * b.speedY * 45 + b.phase) * 45
        const br = Math.min(w, h) * b.radius
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        g.addColorStop(0, `hsla(${b.hue}, 75%, 60%, ${b.alpha * 1.5})`)
        g.addColorStop(0.3, `hsla(${b.hue}, 60%, 50%, ${b.alpha * 0.8})`)
        g.addColorStop(0.6, `hsla(${b.hue}, 45%, 42%, ${b.alpha * 0.35})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      for (const star of stars) {
        const tw = Math.sin(time * star.speed * 38 + star.phase) * 0.5 + 0.5
        const a = star.alpha * (0.3 + tw * 0.7)
        if (a < 0.012) continue
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * (0.65 + tw * 0.35), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, 28%, 84%, ${a})`
        ctx.fill()
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.997
        p.vy *= 0.997
        p.vx += (Math.random() - 0.5) * 0.008
        p.vy += (Math.random() - 0.5) * 0.008
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 0.4) { p.vx = (p.vx / spd) * 0.4; p.vy = (p.vy / spd) * 0.4 }
        if (p.x < -40) p.x = w + 40; if (p.x > w + 40) p.x = -40
        if (p.y < -40) p.y = h + 40; if (p.y > h + 40) p.y = -40
        const tw = Math.sin(time * 1.0 + p.phase) * 0.5 + 0.5
        const a = p.baseAlpha * (0.45 + tw * 0.55)
        if (a < 0.012) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.75 + tw * 0.25), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 65%, 65%, ${a})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [init])

  return <canvas ref={canvasRef} className="global-bg-canvas" aria-hidden="true" />
}
