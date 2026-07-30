import CheckIcon from '@mui/icons-material/Check'
import { included } from '../data/site'
import Reveal, { MaskReveal } from './Reveal'

export default function Included() {
  return (
    <section id="included" className="band [--band:var(--color-cream)] py-16 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal as="p" from="left" className="eyebrow mb-6 text-ink/50">
              {included.label}
            </Reveal>

            <MaskReveal
              as="h2"
              className="font-display text-huge uppercase leading-[0.88] tracking-[-0.02em]"
              lines={[
                included.heading[0],
                <span key="b" className="text-flame">
                  {included.heading[1]}
                </span>,
              ]}
            />
          </div>

          <ul className="md:col-span-6 md:col-start-7 md:pt-2">
            {included.items.map((item, i) => (
              <Reveal
                key={item.title}
                as="li"
                from="right"
                delay={i * 0.06}
                amount={0.2}
                className="flex gap-4 border-b border-ink/15 py-4 first:border-t first:border-ink/15"
              >
                <CheckIcon sx={{ fontSize: 18 }} className="mt-0.5 shrink-0 text-flame" />
                <span>
                  <span className="block text-[15px] tracking-tight">{item.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink/60">
                    {item.body}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
