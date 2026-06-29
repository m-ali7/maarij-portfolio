import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  hue: number
  sat: number
  light: number
  alpha: number
  baseAlpha: number
  phase: number
}

interface Star {
  x: number
  y: number
  size: number
  alpha: number
  speed: number
  phase: number
  hue: number
}

interface NebulaBlob {
  x: number
  y: number
  radius: number
  hue: number
  alpha: number
  speedX: number
  speedY: number
  phase: number
}

interface MouseState {
  x: number
  y: number
  targetX: number
  targetY: number
  isActive: boolean
}

const PARTICLE_COUNT = 120
const STAR_COUNT = 180
const CONNECTION_DIST = 150
const MOUSE_REPEL_RADIUS = 200
const MOUSE_GLOW_RADIUS = 400

const NEBULA_CONFIGS: Omit<NebulaBlob, 'phase'>[] = [
  { x: 0.18, y: 0.25, radius: 0.35, hue: 220, alpha: 0.09, speedX: 0.0002, speedY: 0.0003 },
  { x: 0.72, y: 0.35, radius: 0.30, hue: 260, alpha: 0.08, speedX: -0.0003, speedY: 0.0002 },
  { x: 0.45, y: 0.55, radius: 0.38, hue: 195, alpha: 0.08, speedX: 0.00015, speedY: -0.00025 },
  { x: 0.85, y: 0.65, radius: 0.28, hue: 280, alpha: 0.06, speedX: -0.0002, speedY: 0.00015 },
  { x: 0.15, y: 0.70, radius: 0.32, hue: 200, alpha: 0.07, speedX: 0.00025, speedY: -0.0002 },
  { x: 0.55, y: 0.15, radius: 0.25, hue: 240, alpha: 0.06, speedX: -0.00015, speedY: 0.0003 },
]

export default function HeroCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const starsRef = useRef<Star[]>([])
  const blobsRef = useRef<NebulaBlob[]>([])
  const mouseRef = useRef<MouseState>({
    x: -200, y: -200, targetX: -200, targetY: -200, isActive: false,
  })
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)
  const dimsRef = useRef({ w: 0, h: 0 })

  const init = useCallback((w: number, h: number) => {
    dimsRef.current = { w, h }
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const h = Math.random() < 0.5 ? 200 + Math.random() * 40 : 270 + Math.random() * 30
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 1, baseSize: Math.random() * 2 + 1,
        hue: h, sat: 60 + Math.random() * 30, light: 60 + Math.random() * 25,
        alpha: Math.random() * 0.5 + 0.1, baseAlpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
      })
    }
    particlesRef.current = particles

    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        size: Math.random() * 1.6 + 0.3, alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.04 + 0.008, phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.6 ? 210 + Math.random() * 30 : 270 + Math.random() * 20,
      })
    }
    starsRef.current = stars

    blobsRef.current = NEBULA_CONFIGS.map((c) => ({
      ...c,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) mouseRef.current.isActive = false

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

    if (!isTouch) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouseRef.current.targetX = e.clientX - rect.left
        mouseRef.current.targetY = e.clientY - rect.top
        mouseRef.current.isActive = true
      }
      const onMouseLeave = () => { mouseRef.current.isActive = false }
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    const animate = (ts: number) => {
      const { w, h } = dimsRef.current
      const time = ts * 0.001
      timeRef.current = time
      const mouse = mouseRef.current

      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      ctx.clearRect(0, 0, w, h)

      // --- Nebula blobs ---
      const blobs = blobsRef.current
      for (const b of blobs) {
        const bx = w * b.x + Math.sin(time * b.speedX * 100 + b.phase) * 40
        const by = h * b.y + Math.cos(time * b.speedY * 100 + b.phase) * 40
        const br = Math.min(w, h) * b.radius
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        grad.addColorStop(0, `hsla(${b.hue}, 70%, 55%, ${b.alpha * 1.3})`)
        grad.addColorStop(0.4, `hsla(${b.hue}, 60%, 45%, ${b.alpha * 0.7})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)

        if (mouse.isActive) {
          const dx = bx - mouse.x
          const dy = by - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < br * 1.5) {
            const pull = (1 - dist / (br * 1.5)) * 0.015
            const ang = Math.atan2(dy, dx)
            b.phase += Math.cos(ang + time) * pull * 0.1
          }
        }
      }

      // --- Aurora bands ---
      for (let band = 0; band < 3; band++) {
        const baseY = h * (0.08 + band * 0.06)
        const bandHue = [200, 230, 260][band]
        ctx.beginPath()
        ctx.moveTo(0, baseY)
        for (let px = 0; px <= w; px += 3) {
          const waveY =
            baseY +
            Math.sin(px * 0.003 + time * 0.4 + band * 1.5) * 25 +
            Math.sin(px * 0.007 + time * 0.6 + band) * 15 +
            Math.sin(px * 0.012 + time * 0.35) * 10
          ctx.lineTo(px, waveY)
        }
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()

        const auroraGrad = ctx.createLinearGradient(0, baseY, 0, baseY + 120)
        auroraGrad.addColorStop(0, `hsla(${bandHue}, 70%, 55%, 0.06)`)
        auroraGrad.addColorStop(0.5, `hsla(${bandHue + 30}, 60%, 45%, 0.03)`)
        auroraGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = auroraGrad
        ctx.fill()
      }

      // --- Stars ---
      const stars = starsRef.current
      for (const star of stars) {
        const twinkle = Math.sin(time * star.speed * 60 + star.phase) * 0.5 + 0.5
        const alpha = star.alpha * (0.35 + twinkle * 0.65)
        const size = star.size * (0.7 + twinkle * 0.3)
        if (alpha < 0.02) continue
        ctx.beginPath()
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, 30%, 85%, ${alpha})`
        ctx.fill()
      }

      // --- Particles ---
      const particles = particlesRef.current
      for (const p of particles) {
        if (mouse.isActive) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_REPEL_RADIUS) {
            const force = (1 - dist / MOUSE_REPEL_RADIUS) * 0.45
            p.vx += (dx / (dist + 0.01)) * force * 0.08
            p.vy += (dy / (dist + 0.01)) * force * 0.08
          }
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.996
        p.vy *= 0.996
        p.vx += (Math.random() - 0.5) * 0.015
        p.vy += (Math.random() - 0.5) * 0.015
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 0.7) { p.vx = (p.vx / speed) * 0.7; p.vy = (p.vy / speed) * 0.7 }
        if (p.x < -30) p.x = w + 30
        if (p.x > w + 30) p.x = -30
        if (p.y < -30) p.y = h + 30
        if (p.y > h + 30) p.y = -30
      }

      // --- Particle glow near mouse ---
      for (const p of particles) {
        if (mouse.isActive) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_GLOW_RADIUS) {
            const glowAlpha = (1 - dist / MOUSE_GLOW_RADIUS) * 0.25
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size + 4, 0, Math.PI * 2)
            ctx.fillStyle = `hsla(210, 80%, 65%, ${glowAlpha})`
            ctx.fill()
          }
        }
        const twinkle = Math.sin(time * 1.5 + p.phase) * 0.5 + 0.5
        const alpha = p.baseAlpha * (0.45 + twinkle * 0.55)
        if (alpha < 0.02) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha})`
        ctx.fill()
      }

      // --- Connections ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const effectiveDist = CONNECTION_DIST + (mouse.isActive ? 40 : 0)
          if (dist < effectiveDist) {
            const alpha = (1 - dist / effectiveDist) * 0.08
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            const midHue = (particles[i].hue + particles[j].hue) / 2
            ctx.strokeStyle = `hsla(${midHue}, 70%, 65%, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // --- Mouse spotlight ---
      if (mouse.isActive) {
        const spotlight = ctx.createRadialGradient(
          mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_GLOW_RADIUS,
        )
        spotlight.addColorStop(0, 'hsla(210, 100%, 70%, 0.1)')
        spotlight.addColorStop(0.25, 'hsla(230, 90%, 65%, 0.06)')
        spotlight.addColorStop(0.5, 'hsla(260, 80%, 60%, 0.03)')
        spotlight.addColorStop(1, 'transparent')
        ctx.fillStyle = spotlight
        ctx.fillRect(0, 0, w, h)
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [init])

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
