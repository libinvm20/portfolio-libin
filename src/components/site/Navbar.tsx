import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { profile } from '../../data'
import { GitHubIcon } from './icons'
import ShinyText from '../ShinyText/ShinyText'

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Connect', href: '#connect' },
]

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })

  // Scroll spy: the section under ~1/3 viewport height becomes "active".
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el))

    if (sections.length === 0) return undefined

    const pick = () => {
      const line = window.innerHeight * 0.35
      let current: string | null = null
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= line && rect.bottom > line) current = section.id
      }
      setActive(current)
    }

    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
    }
  }, [])

  // A solid bar once the page moves keeps the floating chips readable while
  // content scrolls beneath them — most noticeable on phones.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile sheet is open: freeze the page behind it, close on
  // Escape, and dismiss it if the viewport grows into the desktop nav.
  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const onWide = () => {
      if (desktop.matches) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onWide)
    return () => {
      root.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open || scrolled
          ? 'border-b border-line/70 bg-veil/85 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.95)] backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-primary via-[#a9a3d8] to-[#5941a9]"
        style={{ scaleX: progress }}
      />

      {/* Scrim and sheet are plain conditional renders: an exit animation that
          never completes (reduced motion, interrupted tweens) would leave the
          sheet mounted over the page and swallow every tap. */}
      {open ? (
        <motion.div
          key="scrim"
          className="fixed inset-0 bg-veil/60 backdrop-blur-sm md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <nav className="container-x relative z-10 flex items-center justify-between gap-2 py-3 sm:gap-3 md:py-4">
        {/* identity chip */}
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="flex min-h-11 items-center gap-2.5 rounded-full border border-line bg-veil/70 py-1.5 pl-1.5 pr-3 shadow-lg shadow-black/40 backdrop-blur-xl transition-colors hover:border-primary/40 active:border-primary/50 sm:pr-4"
        >
          <img
            src={profile.avatar}
            alt={`${profile.name} avatar`}
            width={28}
            height={28}
            className="size-7 rounded-full border border-line object-cover"
          />
          <ShinyText
            text={profile.name}
            speed={3.6}
            color="#e5d4ed"
            shineColor="#a9a3d8"
            className="font-mono text-[0.8rem] font-bold tracking-tight sm:text-sm"
          />
        </a>

        {/* centered link dock with scroll-spy pill */}
        <div className="hidden items-center gap-0.5 rounded-full border border-line bg-veil/70 p-1 shadow-lg shadow-black/40 backdrop-blur-xl md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative block rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive ? 'text-ink' : 'text-dim hover:text-ink'
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] shadow-[0_0_16px_-2px] shadow-primary/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{link.label}</span>
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* action chip — icon-only on phones so the menu button always fits */}
          <motion.div
            whileHover={{ y: -2, scale: 1.05, boxShadow: '0 8px 22px -8px rgba(109, 114, 195, 0.5)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="inline-block"
            style={{ boxShadow: '0 0 0 0 rgba(109, 114, 195, 0)' }}
          >
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Libin V M on GitHub"
              className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-veil/70 px-3 text-sm font-medium text-ink shadow-lg shadow-black/40 backdrop-blur-xl transition-colors hover:border-primary/50 hover:bg-primary/10 active:bg-primary/15 sm:px-4"
            >
              <GitHubIcon className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </motion.div>

          {/* mobile menu trigger */}
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-full border border-line bg-veil/70 text-ink shadow-lg shadow-black/40 backdrop-blur-xl transition-colors active:border-primary/50 active:bg-primary/15 md:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0.5 h-0.5 w-5 rounded bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[13px] h-0.5 w-5 rounded bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open ? (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          className="absolute inset-x-3 top-full z-10 origin-top overflow-hidden rounded-2xl border border-line bg-[#231a30]/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl md:hidden"
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
            <nav aria-label="Site sections" className="flex flex-col">
              {navLinks.map((link, index) => {
                const isActive = active === link.href.slice(1)
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + index * 0.04, duration: 0.24 }}
                    className={`flex min-h-12 items-center justify-between rounded-xl px-4 font-display text-lg font-semibold transition-colors active:bg-white/[0.07] ${
                      isActive ? 'bg-white/[0.05] text-ink' : 'text-dim active:text-ink'
                    }`}
                  >
                    {link.label}
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary/70">
                      {isActive ? 'here' : ''}
                    </span>
                  </motion.a>
                )
              })}
            </nav>
            <div className="mt-1 border-t border-line/70 p-1 pt-2">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 font-mono text-sm text-ink transition-colors active:bg-primary/15"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub · @libinvm20
              </a>
            </div>
        </motion.div>
      ) : null}
    </header>
  )
}
