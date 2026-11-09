import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, type Variants } from 'motion/react'
import Waves from '../Waves/Waves'
import './BootScreen.css'

// Boot overlay: the old static index.html loader rebuilt as a React component
// so the vendored Waves field can run behind it. Phases:
//   boot    — waves flow at 0.9x, letters rise in, status text cycles
//   exit    — letters scatter outward from the middle, waves crank to 5.5x
//   shutter — 9 neon panels close over the field from alternating edges
//   open    — backdrop drops to transparent + renders nothing, panels part,
//             revealing the live site; then onDone unmounts the overlay.

const HOLD_MS = 1400
const EXIT_MS = 480
const PANELS = 9
const CLOSE_MS = 470
const OPEN_MS = 560
const STAGGER_MS = 45
const LAST_DELAY_MS = (PANELS - 1) * STAGGER_MS
const COVERED_AT = HOLD_MS + EXIT_MS + LAST_DELAY_MS + CLOSE_MS
const REVEALED_AT = COVERED_AT + LAST_DELAY_MS + OPEN_MS
const DONE_AT = REVEALED_AT + 40

const STATUS_LINES = [
  'loading runtime modules',
  'warming the neon field',
  'mapping vector lines',
  'crack the code',
]
const WORD = 'LIBIN VM'.split('')
const TINTS = ['#6d72c3', '#a9a3d8', '#5941a9', '#c7bbe2']

const CLOSE_EASE: [number, number, number, number] = [0.83, 0, 0.17, 1]
const OPEN_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Phase = 'boot' | 'exit' | 'shutter' | 'open'

const panelVariants: Variants = {
  // even panels close from below and part upward; odd ones mirror it
  rest: (i: number) => ({ y: i % 2 === 0 ? '103%' : '-103%' }),
  closed: (i: number) => ({
    y: '0%',
    transition: { duration: CLOSE_MS / 1000, delay: (i * STAGGER_MS) / 1000, ease: CLOSE_EASE },
  }),
  open: (i: number) => ({
    y: i % 2 === 0 ? '-104%' : '104%',
    transition: { duration: OPEN_MS / 1000, delay: (i * STAGGER_MS) / 1000, ease: OPEN_EASE },
  }),
}

const letterVariants: Variants = {
  in: (i: number) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { delay: 0.05 + i * 0.048, duration: 0.6, ease: OPEN_EASE },
  }),
  out: (i: number) => {
    const angle = ((((i * 71 + 17) % 360) + 360) % 360) * (Math.PI / 180)
    return {
      x: Math.cos(angle) * (60 + ((i * 37) % 55)),
      y: Math.sin(angle) * (30 + ((i * 23) % 30)) - 28,
      rotate: ((i * 97) % 131) - 65,
      opacity: 0,
      filter: 'blur(7px)',
      transition: { delay: Math.abs(i - (WORD.length - 1) / 2) * 0.03, duration: 0.42, ease: CLOSE_EASE },
    }
  },
}

const LETTER_GRADIENT =
  'linear-gradient(100deg, #e5d4ed 0%, #a9a3d8 24%, #9f8acb 38%, #5941a9 52%, #e5d4ed 76%)'

export interface BootScreenProps {
  onDone: () => void
}

export default function BootScreen({ onDone }: BootScreenProps) {
  const [phase, setPhase] = useState<Phase>('boot')
  const [statusIndex, setStatusIndex] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const leaving = phase !== 'boot'
  const doneRef = useRef(onDone)
  const finishedRef = useRef(false)
  const finishRef = useRef(() => {})
  const skipTimer = useRef(0)

  useEffect(() => {
    doneRef.current = onDone
    // Idempotent completion: the timeline, a skip tap and unmount can all race.
    finishRef.current = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      doneRef.current()
    }
  })

  // Freeze page scroll while the overlay is up.
  useEffect(() => {
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [])

  // Tap (or keyboard-activate) the skip button to drop straight to the page.
  const skip = () => {
    if (finishedRef.current || skipped) return
    setSkipped(true)
    setPhase('open')
    skipTimer.current = window.setTimeout(() => finishRef.current(), 220)
  }

  useEffect(() => () => window.clearTimeout(skipTimer.current), [])

  // The entire timeline is scheduled up front; phase state only steers the
  // visuals. onDone is read through a ref so a fresh callback identity from
  // the parent can never restart this effect.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase('exit'), HOLD_MS),
      window.setTimeout(() => setPhase('shutter'), HOLD_MS + EXIT_MS),
      window.setTimeout(() => setPhase('open'), COVERED_AT),
      window.setTimeout(() => finishRef.current(), DONE_AT),
    ]
    const statuses = window.setInterval(() => {
      setStatusIndex(index => (index + 1) % STATUS_LINES.length)
    }, 450)
    return () => {
      timers.forEach(timer => window.clearTimeout(timer))
      window.clearInterval(statuses)
    }
  }, [])

  const panelBackground = (i: number) => {
    const tint = TINTS[i % TINTS.length]
    // glow rides the leading edge of each panel's closing direction
    return i % 2 === 0
      ? `linear-gradient(180deg, ${tint}30 0%, transparent 45%)`
      : `linear-gradient(180deg, transparent 55%, ${tint}30 100%)`
  }

  return (
    <div
      className="boot"
      role="status"
      aria-label="Loading portfolio"
      data-phase={phase}
      data-skipped={skipped || undefined}
      style={{
        ...(phase === 'open' ? { background: 'transparent' } : null),
        opacity: skipped ? 0 : 1,
        pointerEvents: skipped ? 'none' : undefined,
        transition: 'opacity 0.22s ease',
      }}
    >
      {phase !== 'open' && (
        <>
          <Waves
            className="boot__waves"
            lineColor="#e5d4ed"
            accentColor="#8b8acd"
            spacing={11}
            amplitude={30}
            twist={1.15}
            speed={phase === 'boot' ? 0.9 : 5.5}
            fade={0.35}
            opacity={0.9}
          />
          <div className="boot__vignette" />
          {phase !== 'shutter' && (
            <div className="boot__content">
              <motion.div
                className="boot__badge"
                animate={{ opacity: leaving ? 0 : 1, y: leaving ? -8 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <i className="boot__dot" />
                boot sequence
              </motion.div>
              <h1 className="boot__wordmark" aria-label="LIBIN VM">
                {WORD.map((letter, i) =>
                  letter === ' ' ? (
                    <span key={i} className="boot__gap" />
                  ) : (
                    <motion.span
                      key={i}
                      className="boot__letter"
                      custom={i}
                      variants={letterVariants}
                      initial={{ y: 26, opacity: 0, rotate: -4 }}
                      animate={leaving ? 'out' : 'in'}
                      style={{ backgroundImage: LETTER_GRADIENT, '--boot-i': i } as CSSProperties}
                    >
                      {letter}
                    </motion.span>
                  ),
                )}
              </h1>
              <motion.div
                className="boot__track"
                animate={{ opacity: leaving ? 0 : 1, scaleX: leaving ? 0.55 : 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <i className="boot__track-bar" />
              </motion.div>
              <motion.div
                className="boot__status"
                aria-hidden="true"
                animate={{ opacity: leaving ? 0 : 1 }}
                transition={{ duration: 0.28 }}
              >
                <motion.span
                  key={statusIndex}
                  className="boot__status-line"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                >
                  {STATUS_LINES[statusIndex]}
                </motion.span>
              </motion.div>
            </div>
          )}
        </>
      )}
      <div className="boot__shutters" aria-hidden="true">
        {Array.from({ length: PANELS }, (_, i) => (
          <motion.div
            key={i}
            className="boot__panel"
            custom={i}
            variants={panelVariants}
            initial="rest"
            animate={phase === 'open' ? 'open' : phase === 'shutter' || phase === 'exit' ? 'closed' : 'rest'}
            style={{
              left: `calc((100% / ${PANELS}) * ${i})`,
              width: `calc(100% / ${PANELS} + 1.2%)`,
              backgroundColor: '#2a2034',
              backgroundImage: panelBackground(i),
              boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.035), inset -1px 0 0 rgba(255, 255, 255, 0.035)',
            }}
          />
        ))}
      </div>
      <button type="button" className="boot__skip" onClick={skip}>
        skip intro
      </button>
    </div>
  )
}
