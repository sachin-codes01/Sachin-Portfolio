import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Tooltip from '@mui/material/Tooltip'
import { useColorScheme } from '@mui/material/styles'
import SettingsIcon from '@mui/icons-material/Settings'
import InstagramIcon from '@mui/icons-material/Instagram'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { AnimatePresence, motion } from 'motion/react'
import { nav, site, socials } from '../data/site'
import { onPageScroll, setScrollLocked } from '../lib/useSmoothScroll'

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  Email: AlternateEmailIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
}

function SocialDot({ label, href }) {
  const Icon = SOCIAL_ICONS[label]
  return (
    <Tooltip title={label} placement="bottom" arrow>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="grid size-8 place-items-center rounded-full bg-void text-white transition-colors hover:bg-flame"
      >
        {Icon ? <Icon sx={{ fontSize: 16 }} /> : label}
      </a>
    </Tooltip>
  )
}

function ShareRow() {
  const [copied, setCopied] = useState(false)
  const shareText = `${site.name}'s portfolio`
  const shareUrl = site.url

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const shareToInstagram = async (e) => {
    if (!navigator.share) return
    e.preventDefault()
    try {
      await navigator.share({ title: shareText, url: shareUrl })
    } catch {}
  }

  const targets = [
    {
      label: 'Share on WhatsApp',
      Icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      label: 'Share on Instagram',
      Icon: InstagramIcon,
      href: shareUrl,
      onClick: shareToInstagram,
    },
    {
      label: 'Share on LinkedIn',
      Icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ]

  return (
    <div className="flex items-center justify-between gap-6 border-t border-ink/10 pt-2.5 pb-1">
      <span className="eyebrow text-ink/40">share</span>
      <div className="flex items-center gap-1.5">
        {targets.map((t) => (
          <Tooltip key={t.label} title={t.label} placement="bottom" arrow>
            <a
              href={t.href}
              target="_blank"
              rel="noreferrer"
              aria-label={t.label}
              onClick={t.onClick}
              className="grid size-7 place-items-center rounded-full bg-void text-white transition-colors hover:bg-flame"
            >
              <t.Icon sx={{ fontSize: 14 }} />
            </a>
          </Tooltip>
        ))}
        <Tooltip title={copied ? 'Copied!' : 'Copy link'} placement="bottom" arrow>
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy link"
            className="grid size-7 place-items-center rounded-full bg-void text-white transition-colors hover:bg-flame"
          >
            {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 13 }} />}
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

function SettingsToggleRow({ label, value, onLabel, offLabel, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-6 py-2.5">
      <span className="eyebrow text-ink/40">{label}</span>
      <div className="flex overflow-hidden rounded-full border border-ink/15 text-[11px]">
        <button
          type="button"
          onClick={() => value && onToggle()}
          aria-pressed={!value}
          className={`px-2.5 py-1 transition-colors ${!value ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink'}`}
        >
          {onLabel}
        </button>
        <button
          type="button"
          onClick={() => !value && onToggle()}
          aria-pressed={value}
          className={`px-2.5 py-1 transition-colors ${value ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink'}`}
        >
          {offLabel}
        </button>
      </div>
    </div>
  )
}

function SettingsMenu({ leavesPaused, onToggleLeaves }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState(null)
  const { mode, setMode } = useColorScheme()
  const dark = mode === 'dark'
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const place = () => {
      const r = buttonRef.current?.getBoundingClientRect()
      if (!r) return
      if (window.innerWidth < 768) {
        setCoords({ top: r.bottom + 12, center: true })
      } else {
        setCoords({ top: r.bottom + 12, right: window.innerWidth - r.right })
      }
    }
    place()

    const onClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('pointerdown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  return (
    <div className="relative">
      <Tooltip title="Settings" placement="bottom" arrow>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Settings"
          aria-expanded={open}
          className="grid size-8 place-items-center rounded-full bg-void text-white transition-colors hover:bg-flame"
        >
          <SettingsIcon sx={{ fontSize: 16 }} />
        </button>
      </Tooltip>

      {createPortal(
        <AnimatePresence>
          {open && coords && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -6, x: coords.center ? '-50%' : 0 }}
              animate={{ opacity: 1, y: 0, x: coords.center ? '-50%' : 0 }}
              exit={{ opacity: 0, y: -6, x: coords.center ? '-50%' : 0 }}
              transition={{ duration: 0.18 }}
              style={
                coords.center
                  ? { position: 'fixed', top: coords.top, left: '50%' }
                  : { position: 'fixed', top: coords.top, right: coords.right }
              }
              className="z-999 w-56 rounded-2xl border border-ink/10 bg-paper p-4 text-[13px] text-ink shadow-xl"
            >
              <SettingsToggleRow
                label="theme"
                value={dark}
                onLabel="light"
                offLabel="dark"
                onToggle={() => setMode(dark ? 'light' : 'dark')}
              />
              <SettingsToggleRow
                label="leaves"
                value={leavesPaused}
                onLabel="falling"
                offLabel="paused"
                onToggle={onToggleLeaves}
              />
              <ShareRow />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default function Navbar({ leavesPaused, onToggleLeaves }) {
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
            <SettingsMenu leavesPaused={leavesPaused} onToggleLeaves={onToggleLeaves} />
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
              <div className="mt-6 flex items-center gap-2">
                {socials.map((item) => (
                  <SocialDot key={item.label} {...item} />
                ))}
                <SettingsMenu leavesPaused={leavesPaused} onToggleLeaves={onToggleLeaves} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
