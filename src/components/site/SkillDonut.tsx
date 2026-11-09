import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { colorFor, levelWord, skillLevels } from '../../data'

/* Knowledge pie: every language the profile knows becomes a neon wedge
   sized by self-rated depth. Hovering a wedge or its legend tile pops the
   wedge and swaps the donut's center readout — recruiters can inspect
   slice by slice. Percentages use the largest-remainder method so the
   legend always shows a clean 100%. */

const SIZE = 280
const CENTER = SIZE / 2
const R_OUTER = 126
const R_INNER = 78
const GAP_DEG = 2.4
const START_DEG = -90 // first wedge opens at 12 o'clock

interface Wedge {
  name: string
  level: number
  note: string
  percentInt: number
  share: number
  color: string
  midDeg: number
  d: string
}

function polar(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [CENTER + r * Math.cos(rad), CENTER + r * Math.sin(rad)]
}

/** Annular sector path between two angles (degrees, clockwise). */
function wedgePath(fromDeg: number, toDeg: number): string {
  const span = toDeg - fromDeg
  const large = span > 180 ? 1 : 0
  const [x0, y0] = polar(R_OUTER, fromDeg)
  const [x1, y1] = polar(R_OUTER, toDeg)
  const [x2, y2] = polar(R_INNER, toDeg)
  const [x3, y3] = polar(R_INNER, fromDeg)
  return [
    `M ${x0} ${y0}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${x3} ${y3}`,
    'Z',
  ].join(' ')
}

/** Round percentages so they always sum to exactly 100. */
function largestRemainder(shareList: number[]): number[] {
  const floors = shareList.map(s => Math.floor(s))
  let left = 100 - floors.reduce((sum, f) => sum + f, 0)
  const order = shareList
    .map((s, i) => ({ i, frac: s - Math.floor(s) }))
    .sort((a, b) => b.frac - a.frac)
  const ints = [...floors]
  for (const { i } of order) {
    if (left <= 0) break
    ints[i] += 1
    left -= 1
  }
  return ints
}

export default function SkillDonut() {
  const [active, setActive] = useState<number | null>(null)

  const wedges: Wedge[] = useMemo(() => {
    const langs = skillLevels
      .filter(s => s.category === 'language')
      .sort((a, b) => b.level - a.level)
    const total = langs.reduce((sum, s) => sum + s.level, 0)
    const shares = langs.map(s => (s.level / total) * 100)
    const percents = largestRemainder(shares)

    let acc: { list: Wedge[]; cursor: number } = { list: [], cursor: START_DEG }
    for (let i = 0; i < langs.length; i++) {
      const s = langs[i]
      const sweep = (shares[i] / 100) * 360
      const gap = sweep > GAP_DEG * 3 ? GAP_DEG : sweep * 0.12
      const a0 = acc.cursor + gap / 2
      const a1 = acc.cursor + sweep - gap / 2
      const mid = (a0 + a1) / 2
      acc = {
        list: [
          ...acc.list,
          {
            name: s.name,
            level: s.level,
            note: s.note,
            percentInt: percents[i],
            share: shares[i],
            color: colorFor(s.name),
            midDeg: mid,
            d: wedgePath(a0, a1),
          },
        ],
        cursor: acc.cursor + sweep,
      }
    }
    return acc.list
  }, [])

  const current = active === null ? null : wedges[active]

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col items-center gap-5">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[340px] overflow-visible"
          role="img"
          aria-label="Pie chart showing knowledge depth for every language Libin writes"
        >
        {/* soft backing ring keeps the donut visible before wedges draw in */}
        <circle cx={CENTER} cy={CENTER} r={(R_OUTER + R_INNER) / 2} fill="none" stroke="rgba(229,212,237,0.09)" strokeWidth={R_OUTER - R_INNER} />
        {wedges.map((w, i) => {
          const engaged = active === null || active === i
          // wedge pops outward along its own bisector when hovered
          const rad = (w.midDeg * Math.PI) / 180
          const pop = [Math.cos(rad) * 5, Math.sin(rad) * 5]
          return (
            <motion.path
              key={w.name}
              d={w.d}
              transform={active === i ? `translate(${pop[0]} ${pop[1]})` : undefined}
              fill={w.color}
              fillOpacity={active === i ? 0.4 : 0.24}
              stroke={w.color}
              strokeWidth={active === i ? 4 : 3}
              strokeLinejoin="round"
              style={{
                opacity: engaged ? 1 : 0.32,
                filter: `drop-shadow(0 0 9px ${w.color}${active === i ? 'aa' : '55'})`,
                cursor: 'pointer',
                transition: 'opacity 0.25s, fill-opacity 0.25s',
              }}
              initial={{ pathLength: 0, fillOpacity: 0, opacity: 1 }}
              whileInView={{ pathLength: 1, fillOpacity: active === i ? 0.4 : 0.24 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ pathLength: { duration: 0.9, delay: 0.1 + i * 0.07, ease: 'easeOut' }, fillOpacity: { duration: 0.6, delay: 0.4 + i * 0.07 } }}
              tabIndex={0}
              role="button"
              aria-label={`${w.name} — ${levelWord(w.level)}, about ${w.percentInt}% of my language knowledge`}
              onPointerEnter={event => {
                if (event.pointerType === 'mouse') setActive(i)
              }}
              onPointerLeave={event => {
                if (event.pointerType === 'mouse') setActive(null)
              }}
              onClick={() => setActive(current => (current === i ? null : i))}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActive(current => (current === i ? null : i))
                }
              }}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <title>{`${w.name} — ${levelWord(w.level)}, about ${w.percentInt}% of my language knowledge`}</title>
            </motion.path>
          )
        })}
        {/* center readout — swaps between totals and the hovered slice */}
        <motion.g key={current ? current.name : 'total'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
          <text x={CENTER} y={CENTER - 10} textAnchor="middle" className="fill-ink font-sans" style={{ fontSize: current ? 22 : 34, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {current ? `${current.percentInt}%` : wedges.length}
          </text>
          <text x={CENTER} y={CENTER + 16} textAnchor="middle" className="fill-dim font-mono" style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {current ? current.name : 'languages'}
          </text>
          <text x={CENTER} y={CENTER + 36} textAnchor="middle" className="fill-dim font-mono" style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {current ? levelWord(current.level) : 'self-rated depth'}
          </text>
        </motion.g>
        </svg>

        <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
          tap or hover a wedge or tile — self-rated depth
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {wedges.map((w, i) => (
          <button
            key={w.name}
            type="button"
            onPointerEnter={event => {
              if (event.pointerType === 'mouse') setActive(i)
            }}
            onPointerLeave={event => {
              if (event.pointerType === 'mouse') setActive(null)
            }}
            onClick={() => setActive(current => (current === i ? null : i))}
            aria-pressed={active === i}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className={[
              'rounded-xl border p-3 text-left transition-colors duration-200 active:bg-primary/[0.1]',
              active === i ? 'border-primary/45 bg-primary/[0.07]' : 'border-line bg-white/[0.02] hover:border-white/25',
            ].join(' ')}
          >
            <span className="flex items-center gap-2">
              <i
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: w.color, boxShadow: `0 0 7px ${w.color}99` }}
              />
              <span className="text-sm font-medium text-ink/90">{w.name}</span>
              <span className="ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                {levelWord(w.level)}
              </span>
              <span className="font-mono text-xs text-dim">{w.percentInt}%</span>
            </span>
            <span className="mt-1.5 block text-xs leading-snug text-dim">{w.note}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
