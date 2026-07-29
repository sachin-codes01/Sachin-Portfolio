import { useState } from 'react'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/NorthEast'
import { contact, site } from '../data/site'
import { PROJECT_EMPTY, HANDOFF_DELAY, goToChat, projectMessage, validateProject } from '../lib/form'
import { useEnquiryForm } from '../lib/useEnquiryForm'
import ProjectFields from './ProjectFields'
import Reveal, { MaskReveal } from './Reveal'
import Notice from './Notice'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const { values, errors, update, handleSubmit } = useEnquiryForm({
    empty: PROJECT_EMPTY,
    validate: validateProject,
    onValid: (filled) => {
      setSent(true)
      setTimeout(() => goToChat(site.whatsapp, projectMessage(filled)), HANDOFF_DELAY)
    },
  })

  return (
    <section id="contact" className="rule bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8">
          <MaskReveal
            as="h2"
            className="font-display text-huge uppercase leading-[0.88] tracking-[-0.02em] md:col-span-8"
            lines={[
              contact.heading[0],
              contact.heading[1],
              <span key="c" className="text-flame">
                {contact.heading[2]}
              </span>,
            ]}
          />

          <Reveal from="right" delay={0.15} className="md:col-span-4 md:pt-3">
            <p className="eyebrow text-ink/45">{contact.buildsLabel}</p>
            <ul className="mt-3 border-t border-ink/15">
              {contact.builds.map((item) => (
                <li
                  key={item}
                  className="border-b border-ink/15 py-2 text-[15px] tracking-tight text-ink/85"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-ink/60">{contact.pitch}</p>
          </Reveal>
        </div>

        <Reveal from="up" delay={0.1}>
          <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-ink/70">{contact.intro}</p>
        </Reveal>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          <Reveal from="left" className="md:col-span-3">
            <div className={`w-40 overflow-hidden bg-sand/40 md:w-full ${contact.portrait.ratio}`}>
              <img
                src={contact.portrait.src}
                alt={contact.portrait.alt}
                loading="lazy"
                className="size-full object-cover grayscale"
              />
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink/60">{contact.note}</p>
          </Reveal>

          <Reveal from="right" delay={0.12} className="md:col-span-8 md:col-start-5">
            <form onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
              <ProjectFields values={values} errors={errors} update={update} />

              <div className="flex justify-end sm:col-span-2">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={<SendIcon sx={{ fontSize: 15 }} />}
                  sx={{ minWidth: 200 }}
                >
                  Send project brief
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      <Notice open={sent} onClose={() => setSent(false)}>
        Taking you to WhatsApp — your brief is already typed out.
      </Notice>
    </section>
  )
}
