import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import ClickSpark from './components/ClickSpark/ClickSpark'
import Noise from './components/Noise/Noise'
import CursorFX from './components/site/CursorFX'
import BootScreen from './components/site/BootScreen'
import Navbar from './components/site/Navbar'
import Hero from './components/site/Hero'
import Stats from './components/site/Stats'
import Projects from './components/site/Projects'
import Skills from './components/site/Skills'
import About from './components/site/About'
import Footer from './components/site/Footer'

// NOTE: this site has no router — navigation is anchor-based (#top, #projects,
// #skills, #about, #connect), so NotFound is not rendered by App.tsx.
// src/components/site/NotFound.tsx is a self-contained 404 page, ready to import.
// If react-router (or similar) is added later, wire it in as the wildcard route,
// e.g.:
//
//   import NotFound from './components/site/NotFound'
//   <Route path="*" element={<NotFound />} />
//
// Static hosts (Netlify / Vercel / GitHub Pages) also get public/404.html directly.

const BOOT_SESSION_KEY = 'libin:booted'

/* The intro is a one-time flourish: run it on the first page view of a
   session, and never for visitors who asked the OS for reduced motion.
   Repeat visits (and every internal reload) land straight on content. */
function shouldSkipBoot(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    return window.sessionStorage.getItem(BOOT_SESSION_KEY) === '1'
  } catch {
    // storage blocked (private mode / embedded webview) — show the intro
    return false
  }
}

function App() {
  const [booted, setBooted] = useState(shouldSkipBoot)

  // The #boot shell in index.html only covers the pre-React gap. Once React
  // owns the page, drop it.
  useEffect(() => {
    document.getElementById('boot')?.remove()
  }, [])

  const finishBoot = () => {
    try {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    } catch {
      // storage unavailable — the intro simply runs again next visit
    }
    setBooted(true)
  }

  return (
    <MotionConfig reducedMotion="user">
      {!booted && <BootScreen onDone={finishBoot} />}
      <Navbar />
      <ClickSpark sparkColor="#a9a3d8" sparkSize={11} sparkRadius={30} sparkCount={9}>
        <main>
          <Hero />
          <Stats />
          <Projects />
          <Skills />
          <About />
        </main>
      </ClickSpark>
      <Noise patternAlpha={7} patternRefreshInterval={3} className="z-[70] opacity-60 mix-blend-soft-light" />
      <CursorFX />
      <Footer />
    </MotionConfig>
  )
}

export default App
