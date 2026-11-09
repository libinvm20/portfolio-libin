import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import GradientText from '../GradientText/GradientText'
import Magnet from '../Magnet/Magnet'
import ScrollVelocity from '../ScrollVelocity/ScrollVelocity'
import { registerStep, unregisterStep } from '../perf/LoopManager'
import { profile } from '../../data'
import { ArrowIcon, CheckIcon, DiscordIcon, GitHubIcon, GlobeIcon, YouTubeIcon } from './icons'
import AnimatedContent from '../AnimatedContent/AnimatedContent'

const YEAR = new Date().getFullYear()
const WORDMARK = ['L', 'I', 'B', 'I', 'N']

const SHEEN_CSS = `
@keyframes libin-sheen {
  from { background-position: 0% 50%; }
  to { background-position: 200% 50%; }
}
@keyframes libin-breathe {
  0%, 100% { opacity: 0.45; transform: translate(-50%, 0) scale(1); }
  50% { opacity: 0.85; transform: translate(-50%, 0) scale(1.08); }
}
`

const WORD_GRADIENT =
  'linear-gradient(115deg, #6d72c3 0%, #a9a3d8 30%, #e5d4ed 55%, #5941a9 80%, #6d72c3 100%)'

type LinkItem = { label: string; sub?: string; href: string; external?: boolean }

const explore: LinkItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
]

const builds: LinkItem[] = [
  { label: 'ShiftAPI', sub: '15+ AI models', href: profile.links.shiftapi, external: true },
  { label: 'LykCloud', sub: 'the parent company', href: profile.links.lykcloud, external: true },
  { label: 'MineNotify', sub: 'Discord server panel', href: profile.links.discordBot, external: true },
  { label: 'Minolink', sub: 'free URL shortener', href: 'https://minolink.us.kg/', external: true },
]

const reach: LinkItem[] = [
  { label: 'GitHub', sub: '@libinvm20', href: profile.links.github, external: true },
  { label: 'YouTube', sub: '@LegendYt4k', href: profile.links.youtube, external: true },
  { label: 'RapidAPI', sub: 'ShiftAPI listing', href: profile.links.rapidapi, external: true },
]

const socials = [
  { label: 'GitHub — libinvm20', href: profile.links.github, icon: <GitHubIcon className="h-[18px] w-[18px]" /> },
  { label: 'YouTube — LegendYt4k', href: profile.links.youtube, icon: <YouTubeIcon className="h-[18px] w-[18px]" /> },
  { label: 'LykCloud', href: profile.links.lykcloud, icon: <GlobeIcon className="h-[18px] w-[18px]" /> },
]

/* ---- Connect block (moved into the footer) ----
   The heading blur-in always completes to a fully sharp state — detection is
   rAF-polled (the same bulletproof pattern GiantWordmark uses) instead of
   motion's IntersectionObserver whileInView, which can silently never fire
   when the section is jumped past; that freezing is exactly what the old
   build suffered. Nothing can stall halfway: every word tweens
   blur(9px) → blur(0px) on its own timer once `seen` flips. */

const TITLE_WORDS = ['Crack', 'the', 'code', 'with', 'me']

type ChannelItem = {
  label: string
  sub?: string
  href?: string
  color: string
  icon: ReactNode
  copy?: string
}

const channels: ChannelItem[] = [
  {
    label: 'GitHub',
    sub: 'github.com/libinvm20',
    href: profile.links.github,
    color: '#e5d4ed',
    icon: <GitHubIcon className="size-5" />,
  },
  {
    label: 'YouTube',
    sub: '@LegendYt4k · dev logs',
    href: profile.links.youtube,
    color: '#9f8acb',
    icon: <YouTubeIcon className="size-5" />,
  },
  {
    label: 'Discord',
    color: '#6d72c3',
    icon: <DiscordIcon className="size-5" />,
    copy: '@LegendYt4k',
  },
  {
    label: 'LykCloud',
    sub: 'the parent company',
    href: profile.links.lykcloud,
    color: '#a9a3d8',
    icon: <GlobeIcon className="size-5" />,
  },
]

const CARD_CSS = `
.cta-card { transition: border-color .3s ease, background-color .3s ease; }
.cta-card:hover { border-color: color-mix(in srgb, var(--accent) 55%, transparent); }
.cta-card .cta-label { transition: color .3s ease; }
.cta-card:hover .cta-label { color: var(--accent); }
`

function FooterLink({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.href}
      {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group inline-flex min-h-11 items-center gap-2 py-1 text-sm text-dim transition-colors duration-300 hover:text-ink active:text-ink sm:min-h-0 sm:py-0"
    >
      <span className="relative">
        {item.label}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      {item.sub ? (
        <span className="font-mono text-[0.64rem] text-dim/60 transition-colors duration-300 group-hover:text-dim">
          {item.sub}
        </span>
      ) : null}
      <ArrowIcon className="h-3 w-3 self-center -translate-x-1 pl-px opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </a>
  )
}

function LinkColumn({ title, items, delay }: { title: string; items: LinkItem[]; delay: number }) {
  return (
    <AnimatedContent distance={22} duration={0.7} delay={delay} blur={4}>
      <p className="mb-4 font-mono text-[0.66rem] uppercase tracking-[0.32em] text-primary/90">{title}</p>
      <ul className="space-y-1 sm:space-y-3.5">
        {items.map((item) => (
          <li key={item.label}>
            <FooterLink item={item} />
          </li>
        ))}
      </ul>
    </AnimatedContent>
  )
}

function ShipNotes() {
  const [subbed, setSubbed] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubbed(true)
  }

  return (
    <div className="mt-7 rounded-2xl border border-line bg-white/[0.02] p-4">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-dim/80">ship pings</p>
      {subbed ? (
        <motion.p
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="mt-3 flex items-center gap-2 font-mono text-xs text-[#c7bbe2]"
        >
          <CheckIcon className="h-3.5 w-3.5 shrink-0" />
          you're on the list — pings on launch day
        </motion.p>
      ) : (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <label htmlFor="footer-ping" className="sr-only">
            your email for ship notes
          </label>
          <input
            id="footer-ping"
            required
            type="email"
            placeholder="you@mail.com"
            className="min-h-11 w-full min-w-0 rounded-xl border border-line bg-black/30 px-3 py-2 font-mono text-base text-ink outline-none transition-colors duration-300 placeholder:text-dim/60 focus:border-primary/50 sm:min-h-0 sm:text-xs"
          />
          <motion.button
            type="submit"
            whileHover={{ y: -2, boxShadow: '0 8px 20px -8px rgba(109, 114, 195, 0.55)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="min-h-11 shrink-0 rounded-xl border border-primary/40 bg-primary/15 px-3.5 py-2 font-mono text-sm text-ink transition-colors duration-300 hover:bg-primary/25 active:bg-primary/30 sm:min-h-0 sm:text-xs"
          >
            sub
          </motion.button>
        </form>
      )}
    </div>
  )
}

function LocalTime() {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
  )

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
    const id = window.setInterval(() => setClock(fmt()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return <span className="text-[#a9a3d8]">India — {clock} IST</span>
}

/**
 * The giant full-width "LIBIN" logotype that anchors the footer, Laravel-style.
 * Letters rise from below the fold line with a spring stagger, then a seamless
 * rainbow sheen flows across every glyph forever (site rule: always animate).
 * Each glyph clips its own gradient (bg-clip-text lives on the moving element
 * itself), so per-letter transforms can never break the fill.
 */
function GiantWordmark() {
  const maskRef = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  // Geometry check driven by the shared LoopManager rAF (one frame for the
  // whole page) instead of a per-component rAF + scroll/resize listeners +
  // a 400ms interval. Runs at ~30fps on low-tier devices.
  useEffect(() => {
    if (seen) return undefined
    const step = () => {
      const root = maskRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      if (rect.top < window.innerHeight * 1.02 && rect.bottom > 0) setSeen(true)
    }
    const key = registerStep(step)
    return () => unregisterStep(key)
  }, [seen])

  return (
    <div className="relative px-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[12vw] min-h-24 w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-primary/20 blur-[110px]"
        style={{ animation: 'libin-breathe 7s ease-in-out infinite' }}
      />

      <p className="sr-only">LIBIN</p>

      {/* One moving word carries one continuous gradient — bg-clip-text on the
          block itself. Spanning the full word means the sheen tile never seams
          inside a glyph (the old per-letter clip compressed the whole gradient
          into each letter, which read as a broken/rainbow-band artifact). */}
      <div
        ref={maskRef}
        aria-hidden="true"
        className="relative mx-auto w-fit overflow-hidden pt-[0.14em] pb-[0.16em]"
        style={{ fontSize: 'clamp(5rem, 30vw, 26rem)' }}
      >
        <motion.div
          className="w-fit cursor-default select-none whitespace-nowrap bg-clip-text font-display text-transparent"
          style={{
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            backgroundImage: WORD_GRADIENT,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            animation: 'libin-sheen 9s linear infinite',
          }}
          initial={{ y: '120%', opacity: 0 }}
          animate={seen ? { y: '0%', opacity: 1 } : { y: '120%', opacity: 0 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 130, damping: 18, mass: 0.9 }}
          whileHover={{ y: '-0.055em', transition: { type: 'spring', stiffness: 320, damping: 16 } }}
        >
          {WORDMARK.join('')}
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
        className="relative mt-1 text-center font-mono text-[0.68rem] uppercase tracking-[0.62em] text-dim"
        style={{ marginRight: '-0.62em' }}
      >
        project
      </motion.p>

      <style>{SHEEN_CSS}</style>
    </div>
  )
}

function BrandBlock() {
  return (
    <AnimatedContent distance={26} duration={0.75} blur={5} className="sm:col-span-2 md:col-span-1">
      <div className="max-w-sm md:max-w-none">
        <a href="#top" className="inline-flex items-baseline gap-1.5">
          <span
            className="bg-clip-text font-display text-[1.6rem] font-black tracking-tight text-transparent"
            style={{
              backgroundImage: WORD_GRADIENT,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              animation: 'libin-sheen 9s linear infinite',
            }}
          >
            LIBIN
          </span>
          <span className="font-black text-[1.6rem] tracking-tight text-ink">Project</span>
        </a>

        <p className="mt-3 text-sm leading-relaxed text-dim">{profile.tagline}</p>

        <div className="mt-6 flex items-center gap-2.5">
          {socials.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              whileHover={{ y: -3, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="grid size-11 place-items-center rounded-xl border border-line bg-white/[0.04] text-dim transition-colors duration-300 hover:border-primary/40 hover:text-ink active:border-primary/50 active:bg-primary/10"
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        <ShipNotes />
      </div>
    </AnimatedContent>
  )
}

function TopRow(): ReactNode {
  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 md:grid-cols-[1.15fr_1fr_1fr_1fr] md:gap-8">
        <BrandBlock />
        <LinkColumn title="explore" items={explore} delay={0.08} />
        <LinkColumn title="builds" items={builds} delay={0.16} />
        <LinkColumn title="connect" items={reach} delay={0.24} />
      </div>
    </div>
  )
}

function BottomBar() {
  return (
    <div className="container-x pb-8 pt-2" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-center md:flex-row md:text-left">
      <p className="flex flex-wrap items-center justify-center gap-x-2 font-mono text-xs text-dim md:justify-start">
        <span>© {YEAR} {profile.name} · LykCloud Pvt Ltd</span>
        <span aria-hidden="true">·</span>
        <LocalTime />
      </p>
        <p className="font-mono text-xs text-dim">
          built with <span className="text-ink">React</span> +{' '}
          <a
            href="https://reactbits.dev"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary"
          >
            React Bits
          </a>
        </p>
        <Magnet magnetStrength={1.8} padding={56}>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -2, boxShadow: '0 8px 22px -8px rgba(109, 114, 195, 0.5)' }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-xs text-dim transition-colors hover:border-primary/40 hover:text-ink active:border-primary/50 active:text-ink"
            style={{ boxShadow: '0 0 0 0 rgba(109, 114, 195, 0)' }}
          >
            <ArrowIcon className="h-3.5 w-3.5 -rotate-45" />
            back to top
          </motion.button>
        </Magnet>
      </div>
    </div>
  )
}

function ChannelCards({ seen }: { seen: boolean }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyHandle = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard API can be unavailable — fall back to a silent execCommand copy
      const helper = document.createElement('textarea')
      helper.value = text
      helper.style.position = 'fixed'
      helper.style.opacity = '0'
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      helper.remove()
    }
    setCopied(label)
    window.setTimeout(() => setCopied(current => (current === label ? null : current)), 1800)
  }

  return (
    <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:mt-9 sm:grid-cols-4 sm:gap-3">
      {channels.map((channel, i) => {
        const copiedNow = copied === channel.label
        const sub = copiedNow
          ? 'copied to clipboard ✓'
          : channel.copy
            ? `${channel.copy} — tap to copy`
            : channel.sub
        const shared = {
          'aria-label': `${channel.label} — ${copiedNow ? 'username copied' : sub}`,
          className: 'cta-card group relative flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border border-line bg-white/[0.02] px-3 py-4 text-center sm:px-4 sm:py-5',
          style: { '--accent': channel.color } as CSSProperties,
          initial: false,
          animate: seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
          transition: { duration: 0.6, delay: 0.35 + i * 0.09, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
          whileHover: { y: -5, boxShadow: `0 14px 34px -16px ${channel.color}80` },
          whileTap: { scale: 0.97 },
        }
        const inner = (
          <>
            <span
              className="grid size-11 place-items-center rounded-xl transition-colors duration-300"
              style={{ backgroundColor: `${channel.color}14`, color: channel.color, filter: `drop-shadow(0 0 6px ${channel.color}44)` }}
            >
              {channel.icon}
            </span>
            <span className="cta-label text-sm font-semibold text-ink/90">{channel.label}</span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-dim/70">{sub}</span>
            <ArrowIcon className="absolute right-3 top-3 h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </>
        )
        return channel.copy ? (
          <motion.button
            key={channel.label}
            type="button"
            onClick={() => {
              if (channel.copy) void copyHandle(channel.label, channel.copy)
            }}
            {...shared}
          >
            {inner}
          </motion.button>
        ) : (
          <motion.a key={channel.label} href={channel.href} target="_blank" rel="noreferrer" {...shared}>
            {inner}
          </motion.a>
        )
      })}
    </div>
  )
}

function ConnectBlock() {
  const revealRef = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return undefined
    // Geometry check driven by the shared LoopManager rAF (one frame for the
    // whole page) instead of a per-component rAF + scroll/resize listeners +
    // a 400ms interval. Runs at ~30fps on low-tier devices.
    const step = () => {
      const root = revealRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      if (rect.top < window.innerHeight * 1.02 && rect.bottom > 0) setSeen(true)
    }
    const key = registerStep(step)
    return () => unregisterStep(key)
  }, [seen])

  const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number]

  return (
    <div className="container-x relative pt-16 md:pt-20">
      <div ref={revealRef} className="flex flex-col items-center text-center">
        {/* eyebrow */}
        <motion.p
          initial={false}
          animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-primary"
        >
          connect
        </motion.p>

        {/* blur-in headline — every word tweens blur(9px)→blur(0px) and
            stops there, so it can never hang in a frozen blur */}
        <h2 className="font-display mt-4 flex max-w-3xl flex-wrap items-baseline justify-center gap-x-[0.28em] text-3xl font-black tracking-tight text-ink md:text-5xl">
          {TITLE_WORDS.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={false}
              animate={seen ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0.2, y: 10, filter: 'blur(9px)' }}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.09, ease: easeOut }}
              className="inline-block"
            >
              {word !== 'me' ? (
                word
              ) : (
                <GradientText
                  colors={['#c7bbe2', '#a9a3d8', '#9f8acb', '#c7bbe2']}
                  animationSpeed={8}
                >
                  {word}
                </GradientText>
              )}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={false}
          animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.55, delay: 0.6, ease: 'easeOut' }}
          className="mt-4 max-w-[52ch] text-sm text-[#c7bbe2] md:text-base"
        >
          Code, videos, bots and builds — pick a channel below.
        </motion.p>

        <motion.div
          initial={false}
          animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.55, delay: 0.72, ease: 'easeOut' }}
          className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-xs text-dim"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a9a3d8] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#a9a3d8]" />
          </span>
          open for builds &amp; collabs — replies &lt; 24h
        </motion.div>

        <ChannelCards seen={seen} />
      </div>

      <style>{CARD_CSS}</style>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      id="connect"
      className="relative scroll-mt-24 overflow-hidden border-t border-line bg-[radial-gradient(120%_90%_at_50%_115%,rgba(109,114,195,0.12),transparent_60%)]"
    >
      {/* kinetic entry strip — outlined type drifting into the footer */}
      <div aria-hidden="true" className="border-b border-line py-2">
        <ScrollVelocity
          texts={[
            <span
              key="footer-strip"
              className="outlined font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold uppercase tracking-tight"
            >
              let&rsquo;s build something&ensp;·&ensp;say hi&ensp;·&ensp;open for work&ensp;·
            </span>,
          ]}
          velocity={-14}
          numCopies={4}
          gap={28}
          className="flex items-center"
        />
      </div>
      <ConnectBlock />
      <TopRow />
      <div className="mt-14 md:mt-16">
        <GiantWordmark />
      </div>
      <BottomBar />
    </footer>
  )
}
