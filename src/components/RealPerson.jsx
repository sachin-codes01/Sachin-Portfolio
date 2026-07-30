import Button from '@mui/material/Button'
import { person } from '../data/site'
import Reveal, { MaskReveal } from './Reveal'

function Note({ children, className = '' }) {
  return (
    <blockquote
      className={`border-l border-ink/25 py-1 pl-4 text-[13px] leading-[1.7] text-ink/70 ${className}`}
    >
      {children}
    </blockquote>
  )
}

export default function RealPerson() {
  return (
    <section id="person" className="band [--band:var(--color-cream)] py-16 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <MaskReveal
          as="h2"
          className="font-display text-[11vw] uppercase leading-[0.86] tracking-[-0.02em] md:text-[8vw]"
          lines={[
            <span key="a" className="flex flex-wrap items-baseline justify-between gap-x-6">
              <span>I&apos;m also</span>
              <span className="hidden md:inline">person!</span>
            </span>,
            <span key="b" className="block md:pl-[18vw]">
              a <span className="text-flame">real</span>
              <span className="md:hidden"> person!</span>
            </span>,
          ]}
        />

        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col justify-between gap-8 md:col-span-3">
            <Reveal from="left" delay={0.05}>
              <Note>{person.notes[0]}</Note>
            </Reveal>
            <Reveal from="left" delay={0.14} className="hidden md:block">
              <Button
                href="#contact"
                variant="contained"
                color="secondary"
                sx={{ alignSelf: 'flex-start' }}
              >
                {person.cta}
              </Button>
            </Reveal>
          </div>

          <Reveal as="figure" from="scale" delay={0.08} duration={1.1} className="md:col-span-5 md:col-start-4">
            <div className="overflow-hidden bg-sand/40">
              <img
                src={person.portrait}
                alt="Sachin Kumar"
                loading="lazy"
                className="aspect-4/5 w-full object-fill grayscale contrast-125 transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </Reveal>

          <div className="flex flex-col justify-center gap-8 md:col-span-3 md:col-start-10">
            <Reveal from="right" delay={0.12}>
              <Note>{person.notes[1]}</Note>
            </Reveal>
            <Reveal from="right" delay={0.2}>
              <Note>{person.notes[2]}</Note>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="md:hidden">
            <Button href="#contact" variant="contained" color="secondary" fullWidth>
              {person.cta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
