import { process } from '../data/site'
import Reveal, { MaskReveal } from './Reveal'

export default function Process() {
  return (
    <section id="process" className="band [--band:var(--color-paper)] py-16 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <Reveal as="p" from="left" className="eyebrow mb-6 text-ink/50">
          {process.label}
        </Reveal>

        <MaskReveal
          as="h2"
          className="font-display text-huge uppercase leading-[0.88] tracking-[-0.02em]"
          lines={[
            process.heading[0],
            <span key="b" className="text-flame">
              {process.heading[1]}
            </span>,
          ]}
        />

        <ol className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-5 md:gap-y-0">
          {process.steps.map((step, i) => (
            <Reveal
              key={step.id}
              as="li"
              from="up"
              delay={i * 0.08}
              amount={0.2}
              className="border-t border-ink/20 pt-4"
            >
              <span className="font-wide text-[11px] text-ink/40 tabular-nums">{step.id}</span>
              <h3 className="mt-2 font-display text-2xl uppercase leading-none tracking-[-0.01em] md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/65">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
