import ScrollVelocity from '../ScrollVelocity/ScrollVelocity'
import AnimatedContent from '../AnimatedContent/AnimatedContent'
import TechChip from '../TechChip/TechChip'
import { SiGithub } from 'react-icons/si'
import SkillDonut from './SkillDonut'
import SkillBars from './SkillBars'
import { githubAudit, profile, skills, focusAreas } from '../../data'

function TickerRow({ items, activity = false, muted = false }: { items: string[]; activity?: boolean; muted?: boolean }) {
  return (
    <>
      {items.map((item, i) => (
        <TechChip key={`${item}-${i}`} item={item} index={i} activity={activity} muted={muted} />
      ))}
    </>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 overflow-hidden border-y border-line py-14 sm:py-16 md:py-20">
      <AnimatedContent
        distance={24}
        duration={0.7}
        blur={4}
        className="container-x mb-12 flex flex-col items-center gap-2 text-center"
      >
        <div className="mb-6 flex w-full items-center gap-4" aria-hidden="true">
          <span className="font-mono text-[0.66rem] tracking-[0.2em] text-primary">02</span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.34em] text-dim">stack &amp; depth</span>
        </div>
        <h2 className="section-title font-display text-balance">Skills &amp; knowledge</h2>
        <p className="max-w-[62ch] text-pretty text-sm text-[#c7bbe2] md:text-base">
          Every language, framework and tool I know, rated by depth and tied to what
          actually ships — laid out so teams can read my stack at a glance.
        </p>
      </AnimatedContent>

      <div className="container-x space-y-10">
        {/* knowledge pie: one wedge per language, sized by depth */}
        <SkillDonut />

        {/* bar meters: frameworks, platforms and tooling */}
        <SkillBars />

        {/* live GitHub footprint — the pie's receipts */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-line bg-white/[0.02] px-4 py-3.5 text-center font-mono text-[0.7rem] leading-relaxed text-dim sm:px-5 sm:text-xs">
          <SiGithub className="size-4 shrink-0 text-ink/70" aria-hidden="true" />
          <span>
            straight from GitHub: <span className="text-ink/85">{githubAudit.originalRepos} original repos</span>
            {' '}(+{githubAudit.forks} forks) — most-used: {githubAudit.topLanguages.join(', ')}
          </span>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-primary transition-colors hover:text-ink hover:underline"
          >
            github.com/libinvm20
          </a>
        </div>
      </div>

      <div className="container-x mt-10 space-y-4">
        <ScrollVelocity
          texts={[<TickerRow key="row-a" items={skills} />]}
          velocity={20}
          numCopies={6}
          gap={12}
          pauseOnHover
          fadeEdges
          className="flex items-center"
        />
        <ScrollVelocity
          texts={[<TickerRow key="row-b" items={focusAreas} activity muted />]}
          velocity={-14}
          numCopies={6}
          gap={12}
          pauseOnHover
          fadeEdges
          className="flex items-center"
        />
      </div>
    </section>
  )
}
