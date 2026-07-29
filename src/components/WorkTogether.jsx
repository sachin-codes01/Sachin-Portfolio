import { useState } from 'react'
import Button from '@mui/material/Button'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import SendIcon from '@mui/icons-material/NorthEast'
import { site, workTogether } from '../data/site'
import { COLLAB_EMPTY, HANDOFF_DELAY, collabMessage, goToChat, validateCollab } from '../lib/form'
import { useEnquiryForm } from '../lib/useEnquiryForm'
import CollabFields from './CollabFields'
import Reveal, { MaskReveal } from './Reveal'
import Notice from './Notice'

function ContactLink({ label, href, external }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="group flex items-center gap-3 border-b border-ink/25 py-4 text-2xl tracking-tight transition-colors hover:text-flame md:text-[28px]"
      >
        <span>{label}</span>
        <ArrowOutwardIcon
          sx={{ fontSize: 20 }}
          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      </a>
    </li>
  )
}

export default function WorkTogether() {
  const [sent, setSent] = useState(false)

  const { values, errors, update, handleSubmit } = useEnquiryForm({
    empty: COLLAB_EMPTY,
    validate: validateCollab,
    onValid: (filled) => {
      setSent(true)
      setTimeout(() => goToChat(site.whatsapp, collabMessage(filled)), HANDOFF_DELAY)
    },
  })

  return (
    <section id="work-together" className="rule bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-375 px-5 md:px-10">
        <MaskReveal
          as="h2"
          className="font-display text-huge uppercase leading-[0.88] tracking-[-0.02em]"
          lines={[
            workTogether.heading[0],
            <span key="b" className="text-flame">
              {workTogether.heading[1]}
            </span>,
          ]}
        />

        <Reveal from="up" delay={0.1}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/70">{workTogether.intro}</p>
        </Reveal>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          <Reveal from="left" className="md:col-span-6">
            <form onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
              <CollabFields values={values} errors={errors} update={update} />

              <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                <p className="max-w-60 text-[12px] leading-snug text-ink/50">
                  {workTogether.formNote}
                </p>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={<SendIcon sx={{ fontSize: 15 }} />}
                  sx={{ minWidth: 200 }}
                >
                  Let&apos;s connect
                </Button>
              </div>
            </form>
          </Reveal>

          <Reveal
            from="right"
            delay={0.12}
            className="md:col-span-5 md:col-start-8 md:border-l md:border-ink/20 md:pl-10"
          >
            <p className="eyebrow text-ink/45">{workTogether.linksLabel}</p>
            <ul className="mt-3">
              {workTogether.links.map((link) => (
                <ContactLink key={link.label} {...link} />
              ))}
            </ul>
            <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-ink/60">
              {workTogether.availability}
            </p>
          </Reveal>
        </div>
      </div>

      <Notice open={sent} onClose={() => setSent(false)}>
        Taking you to WhatsApp — your message is already typed out.
      </Notice>
    </section>
  )
}
