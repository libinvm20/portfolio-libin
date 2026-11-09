import SectionHeader from './SectionHeader'
import GlareHover from '../GlareHover/GlareHover'
import Squares from '../Squares/Squares'
import AnimatedContent from '../AnimatedContent/AnimatedContent'
import { projects, type Project } from '../../data'
import { ArrowIcon } from './icons'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const internal = project.href.startsWith('/')
  return (
    <GlareHover
      glareColor="#a9a3d8"
      glareOpacity={0.35}
      glareSize={26}
      softness={0.8}
      variant="streak"
      blendMode="screen"
      mode="hover"
      background="rgba(255, 255, 255, 0.02)"
      borderColor="var(--color-line)"
      borderRadius="1.25rem"
      rimGlint={false}
      className="w-full"
    >
      <a
        href={project.href}
        target={internal ? undefined : '_blank'}
        rel="noreferrer"
        className="flex h-full w-full flex-col gap-3 p-5 transition-colors active:bg-white/[0.04] sm:p-6 md:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-balance text-lg font-bold tracking-tight text-ink">{project.title}</h3>
            <p className="font-mono text-xs text-dim">{project.subtitle}</p>
          </div>
          <span className="outlined font-display text-3xl font-bold leading-none" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="text-pretty text-sm leading-relaxed text-[#c7bbe2]">{project.description}</p>
        <div className="mt-auto flex flex-col items-start gap-3 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="chip text-[0.65rem]">
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
            {project.cta}
            <ArrowIcon />
          </span>
        </div>
      </a>
    </GlareHover>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-16 sm:py-20 md:py-28">
      <Squares squareSize={38} borderColor="rgba(229, 212, 237, 0.07)" pulseColor="rgba(109, 114, 195, 0.16)" hoverFillColor="rgba(109, 114, 195, 0.12)" className="-z-10 opacity-70" />
      <div className="container-x">
        <SectionHeader index="01" kicker="selected work" title="Things I am building">
          Products, bots and open-source tools — most of it lives on GitHub, some of it earns a living.
        </SectionHeader>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <AnimatedContent key={project.title} distance={34} duration={0.75} delay={(index % 3) * 0.08} blur={4}>
              <ProjectCard key={project.title} project={project} index={index} />
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}
