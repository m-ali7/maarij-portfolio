import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  ox: number; oy: number
  size: number; baseSize: number
  hue: number; bloomHue: number
  sat: number; light: number
  alpha: number; baseAlpha: number
  phase: number
  layer: 0 | 1 | 2
}

interface Star {
  x: number; y: number
  size: number; alpha: number
  speed: number; phase: number
  hue: number
}

interface NebulaBlob {
  x: number; y: number
  radius: number
  hue: number; alpha: number
  speedX: number; speedY: number
  phase: number
  depth: number
}

const MOUSE_STATE = {
  x: -300, y: -300,
  targetX: -300, targetY: -300,
  isActive: false, isTouch: false,
}

const PARTICLE_CONFIG = [
  { count: 65, layer: 0, sizeRange: [0.6, 1.4], alphaRange: [0.08, 0.25] },
  { count: 35, layer: 1, sizeRange: [1.0, 2.2], alphaRange: [0.12, 0.35] },
  { count: 20, layer: 2, sizeRange: [1.6, 3.2], alphaRange: [0.06, 0.16] },
] as const

const PARTICLE_CONFIG_MOBILE = [
  { count: 30, layer: 0, sizeRange: [0.6, 1.4], alphaRange: [0.06, 0.18] },
  { count: 15, layer: 1, sizeRange: [1.0, 2.2], alphaRange: [0.08, 0.22] },
  { count: 8,  layer: 2, sizeRange: [1.6, 3.2], alphaRange: [0.04, 0.10] },
] as const

const STAR_COUNT = 140
const STAR_COUNT_MOBILE = 70
const CONNECTION_DIST = 110
const MOUSE_REPEL_RADIUS = 200
const MOUSE_GLOW_RADIUS = 480

const NEBULA_BLOBS: Omit<NebulaBlob, 'phase'>[] = [
  { x: 0.22, y: 0.22, radius: 0.36, hue: 325, alpha: 0.09, speedX: 0.00015, speedY: 0.0002, depth: 0 },
  { x: 0.68, y: 0.30, radius: 0.30, hue: 270, alpha: 0.08, speedX: -0.0002, speedY: 0.00015, depth: 0 },
  { x: 0.45, y: 0.52, radius: 0.38, hue: 195, alpha: 0.08, speedX: 0.0001, speedY: -0.00018, depth: 0 },
  { x: 0.80, y: 0.60, radius: 0.26, hue: 300, alpha: 0.07, speedX: -0.00018, speedY: 0.0001, depth: 1 },
  { x: 0.16, y: 0.68, radius: 0.32, hue: 200, alpha: 0.07, speedX: 0.0002, speedY: -0.00015, depth: 1 },
  { x: 0.55, y: 0.15, radius: 0.24, hue: 250, alpha: 0.07, speedX: -0.00012, speedY: 0.00022, depth: 1 },
]

const PARTICLE_HUES = [200, 220, 195, 260, 280, 320, 290, 210, 240, 305]
const STAR_HUES = [215, 200, 270, 310, 230, 290, 195, 260]
const BLOOM_HUES = [320, 290, 340, 270, 200, 310, 185, 285]

function noise1D(t: number, s: number, o: number): number {
  return Math.sin(t * s + o) + Math.sin(t * s * 1.7 + o * 2.1) * 0.4 + Math.cos(t * s * 0.4 + o * 3.3) * 0.25
}

export default function HeroCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const starsRef = useRef<Star[]>([])
  const blobsRef = useRef<NebulaBlob[]>([])
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const dimsRef = useRef({ w: 0, h: 0 })

  const init = useCallback((w: number, h: number) => {
    dimsRef.current = { w, h }
    const isMobile = w <= 768 || h <= 768
    const cfg = isMobile ? PARTICLE_CONFIG_MOBILE : PARTICLE_CONFIG
    const starLimit = isMobile ? STAR_COUNT_MOBILE : STAR_COUNT
    const particles: Particle[] = []
    for (const c of cfg) {
      for (let i = 0; i < c.count; i++) {
        const [lo, hi] = c.sizeRange
        const [al, ah] = c.alphaRange
        const hue = PARTICLE_HUES[Math.floor(Math.random() * PARTICLE_HUES.length)]
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          ox: Math.random() * w, oy: Math.random() * h,
          vx: 0, vy: 0,
          size: lo + Math.random() * (hi - lo),
          baseSize: lo + Math.random() * (hi - lo),
          hue, bloomHue: BLOOM_HUES[Math.floor(Math.random() * BLOOM_HUES.length)],
          sat: 55 + Math.random() * 25,
          light: 58 + Math.random() * 22,
          alpha: al + Math.random() * (ah - al),
          baseAlpha: al + Math.random() * (ah - al),
          phase: Math.random() * Math.PI * 2,
          layer: c.layer,
        })
      }
    }
    particlesRef.current = particles

    const stars: Star[] = []
    for (let i = 0; i < starLimit; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        size: Math.random() * 1.3 + 0.2,
        alpha: Math.random() * 0.55 + 0.08,
        speed: Math.random() * 0.03 + 0.004,
        phase: Math.random() * Math.PI * 2,
        hue: STAR_HUES[Math.floor(Math.random() * STAR_HUES.length)],
      })
    }
    starsRef.current = stars

    blobsRef.current = NEBULA_BLOBS.map((c) => ({ ...c, phase: Math.random() * Math.PI * 2 }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    MOUSE_STATE.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (MOUSE_STATE.isTouch) MOUSE_STATE.isActive = false

    const cachedRect = { left: 0, top: 0 }
    const updateRect = () => {
      const r = canvas.getBoundingClientRect()
      cachedRect.left = r.left; cachedRect.top = r.top
    }
    updateRect()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init(rect.width, rect.height)
      cachedRect.left = rect.left; cachedRect.top = rect.top
    }
    resize()
    window.addEventListener('resize', resize)

    const hero = canvas.parentElement
    const onMove = (e: MouseEvent) => {
      updateRect()
      MOUSE_STATE.targetX = e.clientX - cachedRect.left
      MOUSE_STATE.targetY = e.clientY - cachedRect.top
      MOUSE_STATE.isActive = true
    }
    const onLeave = () => { MOUSE_STATE.isActive = false }

    if (hero && !MOUSE_STATE.isTouch) {
      hero.addEventListener('mousemove', onMove)
      hero.addEventListener('mouseleave', onLeave)
    }

    const animate = (ts: number) => {
      const { w, h } = dimsRef.current
      const time = ts * 0.001
      timeRef.current = time
      const m = MOUSE_STATE

      m.x += (m.targetX - m.x) * 0.05
      m.y += (m.targetY - m.y) * 0.05

      ctx.clearRect(0, 0, w, h)

      // ---- Nebula ----
      const blobs = blobsRef.current
      const mxNorm = m.x / w - 0.5
      const myNorm = m.y / h - 0.5
      for (const b of blobs) {
        const bp = b.depth * 0.015
        const bx = w * b.x + Math.sin(time * b.speedX * 80 + b.phase) * 50 + (m.isActive ? mxNorm * bp * w : 0)
        const by = h * b.y + Math.cos(time * b.speedY * 80 + b.phase) * 50 + (m.isActive ? myNorm * bp * h : 0)
        const br = Math.min(w, h) * b.radius
        let bb = 0
        if (m.isActive) {
          const dx = bx - m.x; const dy = by - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < br * 1.8) bb = (1 - dist / (br * 1.8)) * 0.05
        }
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        g.addColorStop(0, `hsla(${b.hue}, 70%, 60%, ${(b.alpha + bb) * 1.3})`)
        g.addColorStop(0.35, `hsla(${b.hue}, 55%, 48%, ${(b.alpha + bb) * 0.7})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // ---- Aurora ----
      for (let band = 0; band < 2; band++) {
        const baseY = h * (0.06 + band * 0.05)
        const bh = [200, 290][band]
        ctx.beginPath(); ctx.moveTo(0, baseY)
        for (let px = 0; px <= w; px += 5) {
          const wy = baseY +
            Math.sin(px * 0.0025 + time * 0.35 + band * 1.8) * 20 +
            Math.sin(px * 0.006 + time * 0.5 + band) * 10 +
            Math.sin(px * 0.011 + time * 0.3) * 6
          ctx.lineTo(px, wy)
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
        const ag = ctx.createLinearGradient(0, baseY, 0, baseY + 100)
        ag.addColorStop(0, `hsla(${bh}, 55%, 52%, 0.045)`)
        ag.addColorStop(0.5, `hsla(${bh + 20}, 45%, 42%, 0.02)`)
        ag.addColorStop(1, 'transparent')
        ctx.fillStyle = ag; ctx.fill()
      }

      // ---- Stars ----
      for (const star of starsRef.current) {
        const tw = Math.sin(time * star.speed * 55 + star.phase) * 0.5 + 0.5
        const a = star.alpha * (0.3 + tw * 0.7)
        if (a < 0.015) continue
        ctx.beginPath()
        ctx.arc(star.x + (m.isActive ? mxNorm * -4 : 0), star.y + (m.isActive ? myNorm * -4 : 0), star.size * (0.7 + tw * 0.3), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, 25%, 84%, ${a})`
        ctx.fill()
      }

      // ---- Particles (physics) ----
      const parts = particlesRef.current
      for (const p of parts) {
        const sm = [0.2, 0.5, 0.8][p.layer]
        p.vx += noise1D(time * 0.3, 0.002, p.phase) * sm * 0.3 * 0.02
        p.vy += noise1D(time * 0.3, 0.0025, p.phase + 1) * sm * 0.3 * 0.02
        if (m.isActive) {
          const dx = p.x - m.x; const dy = p.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const rd = MOUSE_REPEL_RADIUS * (0.6 + p.layer * 0.4)
          if (dist < rd) {
            const force = (1 - dist / rd) * 0.45 * (0.5 + p.layer * 0.5)
            p.vx += (dx / (dist + 0.01)) * force * 0.05
            p.vy += (dy / (dist + 0.01)) * force * 0.05
          }
        }
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.993; p.vy *= 0.993
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 0.6) { p.vx = (p.vx / spd) * 0.6; p.vy = (p.vy / spd) * 0.6 }
        if (p.x < -40) p.x = w + 40; if (p.x > w + 40) p.x = -40
        if (p.y < -40) p.y = h + 40; if (p.y > h + 40) p.y = -40
      }

      // ---- Draw particles + bloom ----
      for (const p of parts) {
        if (m.isActive) {
          const dx = p.x - m.x; const dy = p.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_GLOW_RADIUS) {
            const ga = (1 - dist / MOUSE_GLOW_RADIUS) * 0.2
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size + 5 + p.layer * 2, 0, Math.PI * 2)
            ctx.fillStyle = `hsla(${p.bloomHue}, 70%, 62%, ${ga})`
            ctx.fill()
          }
        }
        const tw = Math.sin(time * 1.3 + p.phase) * 0.5 + 0.5
        const a = p.baseAlpha * (0.4 + tw * 0.6)
        if (a < 0.015) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${a})`
        ctx.fill()
      }

      // ---- Connections (same-layer only) ----
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          if (parts[i].layer !== parts[j].layer) continue
          const dx = parts[i].x - parts[j].x; const dy = parts[i].y - parts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const bd = CONNECTION_DIST + (m.isActive ? 50 : 0)
          if (dist < bd) {
            const a = (1 - dist / bd) * 0.05
            if (a < 0.004) continue
            ctx.beginPath()
            ctx.moveTo(parts[i].x, parts[i].y)
            ctx.lineTo(parts[j].x, parts[j].y)
            ctx.strokeStyle = `hsla(${(parts[i].hue + parts[j].hue) / 2}, 60%, 60%, ${a})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      // ---- Mouse spotlight ----
      if (m.isActive) {
        const sg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, MOUSE_GLOW_RADIUS)
        sg.addColorStop(0, 'hsla(330, 80%, 68%, 0.07)')
        sg.addColorStop(0.18, 'hsla(295, 70%, 62%, 0.055)')
        sg.addColorStop(0.4, 'hsla(220, 85%, 65%, 0.04)')
        sg.addColorStop(0.65, 'hsla(190, 60%, 55%, 0.02)')
        sg.addColorStop(1, 'transparent')
        ctx.fillStyle = sg
        ctx.fillRect(0, 0, w, h)
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(animate)
    })

    return () => {
      window.removeEventListener('resize', resize)
      if (hero) {
        hero.removeEventListener('mousemove', onMove)
        hero.removeEventListener('mouseleave', onLeave)
      }
      cancelAnimationFrame(rafRef.current)
    }
  }, [init])

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}
