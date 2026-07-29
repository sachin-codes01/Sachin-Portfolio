import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { services, workHeading } from '../data/site'
import Reveal from './Reveal'

export default function HowWeWork() {
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="work" className="bg-cream py-14 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <Reveal as="p" from="left" className="eyebrow mb-8 text-ink/50 md:mb-14">
          {workHeading}
        </Reveal>

        <div>
          {services.map((service, index) => {
            const isOpen = expanded === service.id

            return (
              <Reveal key={service.id} from="left" delay={index * 0.1} amount={0.2}>
                <Accordion
                  expanded={isOpen}
                  onChange={() => setExpanded(isOpen ? null : service.id)}
                >
                  <AccordionSummary
                    aria-controls={`${service.id}-content`}
                    id={`${service.id}-header`}
                    sx={{ cursor: 'pointer' }}
                  >
                    <div className="flex w-full items-center gap-5 py-4 md:gap-10 md:py-6">
                      <span className="w-8 shrink-0 font-wide text-xs text-ink/40 tabular-nums">
                        {service.id}.
                      </span>
                      <span
                        className={`font-display text-[clamp(1.5rem,8vw,5.5rem)] uppercase leading-[0.9] tracking-[-0.01em] transition-colors duration-300 ${
                          isOpen ? 'text-ink' : 'text-ink/75'
                        }`}
                      >
                        {service.title}
                      </span>
                      <span
                        className={`ml-auto hidden h-px w-16 shrink-0 bg-ink transition-all duration-500 md:block ${
                          isOpen ? 'w-24 opacity-100' : 'opacity-30'
                        }`}
                      />
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className="grid gap-6 pb-10 md:grid-cols-12 md:gap-10">
                      <p className="text-[15px] leading-relaxed text-ink/70 md:col-span-6 md:col-start-2">
                        {service.body}
                      </p>
                      <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-4 md:col-start-9">
                        {service.meta.map((item) => (
                          <li key={item} className="eyebrow text-ink/45">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
