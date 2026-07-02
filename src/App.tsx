import { Suspense, lazy } from 'react'
import { Lenis as ReactLenis } from 'lenis/react'
import CustomCursor from './components/CustomCursor'
import GlobalBackground from './components/GlobalBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

const About = lazy(() => import('./components/About'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Stack = lazy(() => import('./components/Stack'))
const Contact = lazy(() => import('./components/Contact'))

function SectionFallback({ id }: { id: string }) {
  return <section id={id} style={{ minHeight: '50vh' }} />
}

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <CustomCursor />
      <GlobalBackground />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback id="about" />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback id="experience" />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback id="projects" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback id="stack" />}>
          <Stack />
        </Suspense>
        <Suspense fallback={<SectionFallback id="contact" />}>
          <Contact />
        </Suspense>
      </main>
    </ReactLenis>
  )
}
