import SectionHeader from './SectionHeader'
import PixelCard from '../PixelCard/PixelCard'
import TechChip from '../TechChip/TechChip'
import AnimatedContent from '../AnimatedContent/AnimatedContent'
import { profile, focusAreas } from '../../data'

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20 md:py-28">
      <div className="container-x grid items-center gap-8 md:grid-cols-[auto,1fr] md:gap-14">
        <div className="flex justify-center md:justify-start">
          <AnimatedContent distance={30} duration={0.7} blur={4}>
            <PixelCard variant="top" gap={22} speed={40} colors={['#6d72c3', '#a9a3d8']} className="rounded-[2rem]">
              <div className="rounded-[2rem] p-3">
                <img
                  src={profile.avatar}
                  alt={`${profile.name} avatar`}
                  width={240}
                  height={240}
                  loading="lazy"
                  className="size-36 rounded-3xl border border-line object-cover shadow-2xl shadow-primary/10 md:size-44 lg:size-48"
                />
              </div>
            </PixelCard>
          </AnimatedContent>
        </div>

        <div>
          <AnimatedContent distance={36} duration={0.75} blur={5}>
            <SectionHeader index="03" kicker="who am i" title="Libin V M — a.k.a. LegendYt4k">
            I am a developer and creator building the LykCloud ecosystem: ShiftAPI for unified AI access, Discord bots
            for real server workflows, and self-hosted tooling for people who like to own their stack. When I am not
            shipping web and cloud services, I am compiling router firmware, automating YouTube uploads and breaking
            things until they are interesting.
          </SectionHeader>
          </AnimatedContent>

          <AnimatedContent distance={24} duration={0.7} delay={0.12} blur={4}>
          <div className="flex flex-wrap gap-2">
            {focusAreas.map((area, i) => (
              <TechChip key={area} item={area} index={i} activity hoverable />
            ))}
          </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  )
}
