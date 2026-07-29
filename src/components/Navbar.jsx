import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { AnimatePresence, motion } from 'motion/react'
import { nav, site, socials } from '../data/site'
import { onPageScroll, setScrollLocked } from '../lib/useSmoothScroll'

function SocialDot({ label, short, href }) {
  return (
    <Tooltip title={label} placement="bottom" arrow>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="grid size-8 place-items-center rounded-full bg-ink text-[10px] font-medium tracking-wide text-white transition-colors hover:bg-flame"
      >
        {short}
      </a>
    </Tooltip>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    return onPageScroll(onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    setScrollLocked(open)
    return () => {
      document.body.style.overflow = ''
      setScrollLocked(false)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-paper/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-375 items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="text-[13px] tracking-tight text-ink/70 transition-colors hover:text-ink">
          {site.domain}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative text-[13px] text-ink/80 transition-colors hover:text-ink"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {socials.map((item) => (
              <SocialDot key={item.label} {...item} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex size-9 flex-col items-center justify-center gap-1.25 md:hidden"
          >
            <span
              className={`h-px w-5 bg-ink transition-transform duration-300 ${open ? 'translate-y-0.75 rotate-45' : ''}`}
            />
            <span
              className={`h-px w-5 bg-ink transition-transform duration-300 ${open ? '-translate-y-0.75 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-paper md:hidden"
          >
            <nav className="flex flex-col gap-1 border-t border-ink/10 px-5 py-6">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl lowercase leading-tight"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-6 flex gap-2">
                {socials.map((item) => (
                  <SocialDot key={item.label} {...item} />
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
