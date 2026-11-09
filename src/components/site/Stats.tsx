import Counter from '../Counter/Counter'
import AnimatedContent from '../AnimatedContent/AnimatedContent'
import { stats } from '../../data'

export default function Stats() {
  return (
    <section className="border-y border-line bg-white/[0.02]">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-7 py-8 md:grid-cols-4 md:py-10">
        {stats.map((stat, index) => (
          <AnimatedContent key={stat.label} distance={26} duration={0.7} delay={index * 0.08} blur={4}>
            <div className="flex flex-col items-center gap-1.5 text-center md:items-start md:text-left">
              <span className="font-mono text-4xl font-semibold text-ink md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} fontSize="inherit" textColor="currentColor" />
              </span>
              <span className="max-w-[22ch] text-xs leading-snug text-dim md:text-sm">{stat.label}</span>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </section>
  )
}
