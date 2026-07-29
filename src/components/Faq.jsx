import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AddIcon from '@mui/icons-material/Add'
import { faq } from '../data/site'
import Reveal, { MaskReveal } from './Reveal'

export default function Faq() {
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="faq" className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <Reveal as="p" from="left" className="eyebrow mb-6 text-ink/50">
          {faq.label}
        </Reveal>

        <MaskReveal
          as="h2"
          className="font-display text-huge uppercase leading-[0.88] tracking-[-0.02em]"
          lines={[
            faq.heading[0],
            <span key="b" className="text-flame">
              {faq.heading[1]}
            </span>,
          ]}
        />

        <div className="mt-12 md:mt-16">
          {faq.items.map((item, i) => {
            const isOpen = expanded === item.q

            return (
              <Reveal key={item.q} from="up" delay={i * 0.05} amount={0.15}>
                <Accordion
                  expanded={isOpen}
                  onChange={() => setExpanded(isOpen ? null : item.q)}
                >
                  <AccordionSummary
                    aria-controls={`faq-${i}-content`}
                    id={`faq-${i}-header`}
                    sx={{ cursor: 'pointer' }}
                  >
                    <div className="flex w-full items-start gap-5 py-4 md:gap-10">
                      <span className="w-8 shrink-0 pt-1 font-wide text-[11px] text-ink/40 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="max-w-3xl text-[17px] leading-snug tracking-tight md:text-[22px]">
                        {item.q}
                      </span>
                      <AddIcon
                        sx={{ fontSize: 20 }}
                        className={`ml-auto mt-1 shrink-0 transition-transform duration-500 ${
                          isOpen ? 'rotate-[135deg] text-flame' : 'text-ink/40'
                        }`}
                      />
                    </div>
                  </AccordionSummary>

                  <AccordionDetails>
                    <p className="max-w-3xl pb-8 text-[14px] leading-relaxed text-ink/70 md:ml-18">
                      {item.a}
                    </p>
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
