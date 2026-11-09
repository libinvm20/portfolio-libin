import type { ReactNode } from 'react'

/* Editorial section header — numbered rule row (a la award-site systems)
   with the display-face title beneath it. */
export default function SectionHeader({
  index,
  kicker,
  title,
  children,
}: {
  index?: string
  kicker: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-8 md:mb-14">
      <div className="flex items-center gap-4" aria-hidden="true">
        {index ? <span className="font-mono text-[0.66rem] tracking-[0.2em] text-[#a9a3d8]">{index}</span> : null}
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.34em] text-[#c7bbe2]">{kicker}</span>
      </div>
      <h2 className="section-title font-display mt-3 text-balance text-ink md:mt-5">{title}</h2>
      {children ? <p className="mt-3 max-w-[62ch] text-pretty text-sm leading-relaxed text-[#c7bbe2] md:text-base">{children}</p> : null}
    </div>
  )
}
