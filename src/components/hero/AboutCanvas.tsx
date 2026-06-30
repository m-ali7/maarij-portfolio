import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number; y: number
  size: number; baseSize: number
  hue: number; alpha: number; baseAlpha: number
  phase: number
  orbitRadius: number; orbitSpeed: number; angle: number
  eccentricity: number; tilt: number
}

interface Star {
  x: number; y: number
  size: number; alpha: number
  speed: number; phase: number
  hue: number
}

interface NebulaBlob {
  x: number; y: number
  radius: number; hue: number; alpha: number
  speedX: number; speedY: number
  phase: number
}

const STAR_COUNT = 130
const PARTICLE_COUNT = 70
const PALETTE = [210, 195, 270, 320, 290, 310, 200, 240, 330, 280, 220, 305]
const STAR_HUES = [215, 200, 270, 310, 230, 290, 195, 260, 320, 240]

const NEBULA_BLOBS: Omit<NebulaBlob, 'phase'>[] = [
  { x: 0.50, y: 0.38, radius: 0.55, hue: 275, alpha: 0.08, speedX: 0.00008, speedY: 0.00012 },
  { x: 0.42, y: 0.52, radius: 0.45, hue: 200, alpha: 0.07, speedX: -0.0001, speedY: -0.00008 },
  { x: 0.58, y: 0.30, radius: 0.40, hue: 320, alpha: 0.06, speedX: 0.00012, speedY: -0.0001 },
  { x: 0.35, y: 0.60, radius: 0.38, hue: 195, alpha: 0.06, speedX: 0.00015, speedY: 0.00008 },
  { x: 0.60, y: 0.65, radius: 0.42, hue: 290, alpha: 0.055, speedX: -0.00008, speedY: 0.00015 },
  { x: 0.48, y: 0.18, radius: 0.35, hue: 220, alpha: 0.06, speedX: 0.00005, speedY: -0.00012 },
]

const FOG_LAYERS = [
  { hue: 220, alpha: 0.025, speed: 0.0003 },
  { hue: 280, alpha: 0.02, speed: -0.00025 },
  { hue: 195, alpha: 0.02, speed: 0.00035 },
]

export default function AboutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const dimsRef = useRef({ w: 0, h: 0 })
  const objectsRef = useRef<{
    stars: Star[]
    particles: Particle[]
    blobs: NebulaBlob[]
  }>({ stars: [], particles: [], blobs: [] })

  const init = useCallback((w: number, h: number) => {
    dimsRef.current = { w, h }
    const cx = w / 2; const cy = h / 2
    const maxDim = Math.min(w, h)

    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = Math.random()
      const dist = r < 0.5
        ? 20 + Math.random() * maxDim * 0.3
        : maxDim * 0.3 + Math.random() * maxDim * 0.5
      const angle = Math.random() * Math.PI * 2
      stars.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist * (0.7 + Math.random() * 0.3),
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
      const angle = Math.random() * Math.PI * 2
      const orbit = 50 + Math.random() * maxDim * 0.42
      const ecc = Math.random() * 0.5
      const tilt = Math.random() * Math.PI
      particles.push({
        x: cx + Math.cos(angle) * orbit,
        y: cy + Math.sin(angle) * orbit,
        size: Math.random() * 2.8 + 0.6,
        baseSize: Math.random() * 2.8 + 0.6,
        hue: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        alpha: Math.random() * 0.4 + 0.06,
        baseAlpha: Math.random() * 0.4 + 0.06,
        phase: Math.random() * Math.PI * 2,
        orbitRadius: orbit,
        orbitSpeed: 0.00015 + Math.random() * 0.0006,
        angle,
        eccentricity: ecc,
        tilt,
      })
    }
    objectsRef.current.particles = particles

    const blobs: NebulaBlob[] = NEBULA_BLOBS.map((c) => ({
      ...c,
      phase: Math.random() * Math.PI * 2,
    }))
    objectsRef.current.blobs = blobs
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init(rect.width, rect.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = (ts: number) => {
      const { w, h } = dimsRef.current
      const time = ts * 0.001
      const cx = w / 2; const cy = h / 2
      const { stars, particles, blobs } = objectsRef.current

      ctx.clearRect(0, 0, w, h)

      // Atmospheric fog layers
      for (const fog of FOG_LAYERS) {
        const fogY = h * 0.45 + Math.sin(time * fog.speed) * h * 0.15
        const g = ctx.createRadialGradient(cx, fogY, 0, cx, fogY, Math.max(w, h) * 0.7)
        g.addColorStop(0, `hsla(${fog.hue}, 50%, 50%, ${fog.alpha * 1.8})`)
        g.addColorStop(0.5, `hsla(${fog.hue}, 40%, 40%, ${fog.alpha * 0.6})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Nebula blobs
      for (const b of blobs) {
        const bx = w * b.x + Math.sin(time * b.speedX * 50 + b.phase) * 55
        const by = h * b.y + Math.cos(time * b.speedY * 50 + b.phase) * 55
        const br = Math.min(w, h) * b.radius
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        g.addColorStop(0, `hsla(${b.hue}, 75%, 60%, ${b.alpha * 1.4})`)
        g.addColorStop(0.3, `hsla(${b.hue}, 60%, 50%, ${b.alpha * 0.8})`)
        g.addColorStop(0.7, `hsla(${b.hue}, 45%, 42%, ${b.alpha * 0.3})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
        // Soft bloom around blob center
        const bloom = ctx.createRadialGradient(bx, by, br * 0.3, bx, by, br * 1.4)
        bloom.addColorStop(0, `hsla(${b.hue}, 80%, 65%, ${b.alpha * 0.3})`)
        bloom.addColorStop(1, 'transparent')
        ctx.fillStyle = bloom
        ctx.fillRect(0, 0, w, h)
      }

      // Stars
      for (const star of stars) {
        const tw = Math.sin(time * star.speed * 40 + star.phase) * 0.5 + 0.5
        const a = star.alpha * (0.3 + tw * 0.7)
        if (a < 0.012) continue
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * (0.65 + tw * 0.35), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, 28%, 84%, ${a})`
        ctx.fill()
        // Bright star sparkle
        if (tw > 0.85 && star.size > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${star.hue}, 40%, 90%, ${a * 0.35})`
          ctx.fill()
        }
      }

      // Orbital particles
      for (const p of particles) {
        p.angle += p.orbitSpeed
        const baseX = cx + Math.cos(p.angle) * p.orbitRadius
        const baseY = cy + Math.sin(p.angle) * p.orbitRadius * (1 - p.eccentricity)
        const rotX = baseX - cx
        const rotY = baseY - cy
        p.x = cx + rotX * Math.cos(p.tilt) - rotY * Math.sin(p.tilt)
        p.y = cy + rotX * Math.sin(p.tilt) + rotY * Math.cos(p.tilt)
        p.x += Math.sin(time * 0.25 + p.phase) * 12
        p.y += Math.cos(time * 0.3 + p.phase) * 12
        const tw = Math.sin(time * 1.1 + p.phase) * 0.5 + 0.5
        const a = p.baseAlpha * (0.45 + tw * 0.55)
        if (a < 0.012) continue
        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 55%, 60%, ${a * 0.2})`
        ctx.fill()
        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.75 + tw * 0.25), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 68%, ${a})`
        ctx.fill()
        // Bright bloom when glowing
        if (tw > 0.75) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 65%, 72%, ${a * 0.15})`
          ctx.fill()
        }
      }

      // Subtle orbital rings
      const rings = [
        { r: 0.18, hue: 220, a: 0.025 },
        { r: 0.30, hue: 280, a: 0.02 },
        { r: 0.42, hue: 195, a: 0.018 },
        { r: 0.50, hue: 320, a: 0.015 },
      ]
      for (const ring of rings) {
        const radius = Math.min(w, h) * ring.r + Math.sin(time * 0.12 + ring.r) * 12
        const tilt = Math.sin(time * 0.08 + ring.r) * 0.3
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1, 1 - Math.abs(tilt) * 0.4)
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${ring.hue}, 60%, 58%, ${ring.a})`
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [init])

  return <canvas ref={canvasRef} className="about-canvas" aria-hidden="true" />
}
