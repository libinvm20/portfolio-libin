import PixelSnow from '../PixelSnow/PixelSnow'
import SplitText from '../SplitText/SplitText'
import RotatingText from '../RotatingText/RotatingText'
import { motion } from 'motion/react'
import GradientText from '../GradientText/GradientText'
import ScrollVelocity from '../ScrollVelocity/ScrollVelocity'
import Magnet from '../Magnet/Magnet'
import StarBorder from '../StarBorder/StarBorder'
import { profile } from '../../data'

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_35%,rgba(109,114,195,0.18),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_72%_65%,rgba(89,65,169,0.16),transparent_70%)]" />
        </div>
        <PixelSnow
          color="#e5d4ed"
          variant="snowflake"
          density={0.55}
          speed={1}
          wind={0.22}
          sway={0.55}
          flakeSize={1.05}
          depth={0.65}
          glow={0.85}
          twinkle={0.4}
          fade={0.25}
          mouseInteraction
        />
        {/* readability scrim — dims the snow behind the copy only; the field stays alive at the edges */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_46%,rgba(29,17,40,0.68),rgba(29,17,40,0.32)_55%,transparent_82%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-veil/40 via-transparent to-veil" />
      </div>

      <div className="container-x relative z-10 flex flex-col items-center gap-5 pt-24 pb-24 text-center sm:gap-6 sm:pt-28 sm:pb-20">
        <span className="inline-flex max-w-[92%] items-center gap-2 rounded-full border border-[#a9a3d8]/40 bg-[#1d1128]/70 px-3 py-1.5 text-center font-mono text-[0.7rem] leading-snug text-[#c7bbe2] shadow-[0_0_26px_rgba(29,17,40,0.65)] backdrop-blur-md sm:text-[0.8rem]">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-[#a9a3d8]" />
          building right now — LykCloud &amp; ShiftAPI
        </span>

        <p className="font-mono text-sm tracking-[0.3em] text-[#c7bbe2] uppercase">Hi, I am</p>

        <SplitText
          text={profile.name}
          tag="h1"
          effect="blur"
          delay={40}
          duration={1.1}
          trigger="load"
          className="m-0 font-display text-[clamp(3rem,11vw,6.5rem)] leading-[0.95] font-extrabold tracking-tight text-ink [text-shadow:0_3px_28px_rgba(29,17,40,0.95),0_0_70px_rgba(29,17,40,0.5)]"
        />

        <GradientText
          colors={['#c7bbe2', '#a9a3d8', '#9f8acb', '#c7bbe2']}
          animationSpeed={7}
          className="text-[clamp(1.05rem,3vw,1.5rem)] font-semibold"
        >
          <span className="block leading-snug">
            <RotatingText
              texts={['Developer', 'Creator', 'Founder']}
              rotationInterval={2.6}
              staggerDuration={0.05}
              staggerFrom="center"
            />
          </span>
        </GradientText>

        <p className="max-w-[60ch] text-pretty text-[clamp(0.95rem,2.5vw,1.1rem)] leading-relaxed text-[#c7bbe2] [text-shadow:0_1px_14px_rgba(29,17,40,0.85)]">
          {profile.tagline}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:mt-4 sm:gap-4">
          <Magnet magnetStrength={1.6} padding={64}>
            <motion.div
            whileHover={{ y: -3, scale: 1.03, boxShadow: '0 10px 30px -10px rgba(109, 114, 195, 0.55)' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="inline-block rounded-full"
            style={{ boxShadow: '0 0 0 0 rgba(109, 114, 195, 0)' }}
          >
            <StarBorder
              as="a"
              href="#projects"
              theme="dark"
              color="#6d72c3"
              trailColor="#c7bbe2"
              thickness={1.5}
              radius={999}
              hover="brighten"
              className="px-6 py-2.5 font-semibold text-ink"
            >
              View my work
            </StarBorder>
          </motion.div>
          </Magnet>
          <Magnet magnetStrength={1.4} padding={56}>
            <motion.div
              whileHover={{ y: -3, scale: 1.03, boxShadow: '0 10px 30px -10px rgba(101, 96, 142, 0.5)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              className="inline-block rounded-xl"
              style={{ boxShadow: '0 0 0 0 rgba(101, 96, 142, 0)' }}
            >
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-center rounded-xl border border-[#a9a3d8]/35 bg-[#1d1128]/65 px-6 py-2.5 font-semibold text-[#c7bbe2] backdrop-blur-md transition-colors hover:border-[#a9a3d8]/60 hover:text-ink active:border-[#a9a3d8]/70 active:bg-[#241733]"
              >
                GitHub →
              </a>
            </motion.div>
          </Magnet>
        </div>

        <p className="font-mono text-[0.66rem] uppercase tracking-[0.5em] text-dim/80">scroll to explore</p>
      </div>

      {/* kinetic strip — outlined display type drifting across the hero floor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 pb-2 sm:pb-3">
        <ScrollVelocity
          texts={[
            <span
              key="hero-strip"
              className="outlined font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold uppercase tracking-tight"
            >
              crack the code&ensp;·&ensp;lykcloud&ensp;·&ensp;shiftapi&ensp;·&ensp;discord bots&ensp;·&ensp;open source&ensp;·
            </span>,
          ]}
          velocity={16}
          numCopies={4}
          gap={28}
          className="flex items-center"
        />
      </div>
    </section>
  )
}
