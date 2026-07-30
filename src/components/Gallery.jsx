import { useCallback, useEffect, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { galleryFallbackHref, projects } from '../data/site'
import Notice from './Notice'
import Reveal from './Reveal'
import SectionMarker from './SectionMarker'

const IDLE_NUMBER = '99'
const IDLE_LABEL = 'Gallery'

const HOVER_INTENT_MS = 550

const numberFor = (index) => String(index + 1).padStart(2, '0')

const arrowSx = {
  border: '1px solid rgba(255,255,255,0.35)',
  color: '#fff',
  width: 44,
  height: 44,
  '&:hover': { background: '#fff', color: '#0b0b0b', borderColor: '#fff' },
  '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.25)' },
}

export default function Gallery() {
  const [active, setActive] = useState(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [toast, setToast] = useState({ open: false, title: '' })
  const activeRef = useRef(null)
  const timer = useRef(null)
  const railRef = useRef(null)

  const apply = (value) => {
    activeRef.current = value
    setActive(value)
  }

  const cancelPending = () => clearTimeout(timer.current)

  const previewOnHover = (index) => {
    cancelPending()
    if (activeRef.current !== null) {
      apply(index)
      return
    }
    timer.current = setTimeout(() => apply(index), HOVER_INTENT_MS)
  }

  const clear = () => {
    cancelPending()
    apply(null)
  }

  const measure = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setEdges({ start: rail.scrollLeft <= 4, end: rail.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    measure()
    rail.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      rail.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  useEffect(() => cancelPending, [])

  const scrollRail = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const panel = rail.firstElementChild
    const distance = panel ? panel.offsetWidth + 4 : rail.clientWidth * 0.8
    rail.scrollBy({ left: distance * direction, behavior: 'smooth' })
  }

  return (
    <section id="gallery" className="band [--band:var(--color-void)] text-white">
      <div className="mx-auto max-w-375 px-5 pt-14 md:px-10 md:pt-20">
        <Reveal as="p" from="left" className="eyebrow mb-6 text-white/45 md:mb-8">
          Selected work — {projects.filter((p) => !p.isMore).length} projects
        </Reveal>
      </div>

      <div onMouseLeave={clear}>
        <div
          ref={railRef}
          className="flex gap-1 overflow-x-auto overflow-y-hidden px-5 scrollbar-none md:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, i) => {
            const isActive = active === i
            const isDimmed = active !== null && !isActive

            return (
              <Reveal
                key={project.title}
                from="up"
                delay={(i % 4) * 0.09}
                amount={0.15}
                className={`aspect-3/4 w-[70vw] shrink-0 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[46vw] md:aspect-auto md:h-[62vh] ${
                  isActive ? 'md:w-[54vw]' : isDimmed ? 'md:w-[16vw]' : 'md:w-[30vw]'
                }`}
              >
                <a
                  href={project.href ?? galleryFallbackHref}
                  {...(project.download
                    ? { download: project.download }
                    : { target: '_blank', rel: 'noreferrer' })}
                  onMouseEnter={() => previewOnHover(i)}
                  onMouseLeave={cancelPending}
                  onFocus={() => apply(i)}
                  onClick={() =>
                    project.download && setToast({ open: true, title: project.title })
                  }
                  aria-label={
                    project.download
                      ? `${project.title} — download the Android app`
                      : `${project.title} — open in a new tab`
                  }
                  className={`group relative block size-full overflow-hidden bg-white/5 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDimmed ? 'md:opacity-40' : 'md:opacity-100'
                  }`}
                >
                  {[
                    { state: 'rest', src: project.shots.rest, show: active === null },
                    { state: 'open', src: project.shots.open, show: isActive },
                    { state: 'slim', src: project.shots.slim, show: isDimmed },
                  ].map(({ state, src, show }) => (
                    <img
                      key={state}
                      src={src}
                      alt={state === 'rest' ? project.title : ''}
                      aria-hidden={state !== 'rest' ? 'true' : undefined}
                      loading="lazy"
                      className={`absolute inset-0 size-full object-fill transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        show ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}

                  {project.isMore && (
                    <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/70 p-4 text-center">
                      <ArrowOutwardIcon sx={{ fontSize: 28 }} />
                      <span className="font-display text-xl uppercase leading-tight tracking-[-0.01em] md:text-3xl">
                        {project.title}
                      </span>
                      <span className="eyebrow text-white/60">On GitHub</span>
                    </span>
                  )}

                  <span
                    className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-ink/80 to-transparent p-3 transition-opacity duration-500 md:p-5 ${
                      project.isMore ? 'hidden' : ''
                    } ${active === null || isActive ? 'opacity-100' : 'md:opacity-0'}`}
                  >
                    <span className="text-[11px] uppercase tracking-[0.14em] md:text-[13px]">
                      {project.title}
                    </span>
                    <span className="hidden text-[11px] text-white/60 tabular-nums md:inline">
                      {project.tag} — {project.year}
                    </span>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>

        <div className="mx-auto flex max-w-375 items-center justify-end gap-2 px-5 py-6 md:px-10">
          <IconButton
            onClick={() => scrollRail(-1)}
            disabled={edges.start}
            aria-label="Scroll gallery left"
            sx={arrowSx}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => scrollRail(1)}
            disabled={edges.end}
            aria-label="Scroll gallery right"
            sx={arrowSx}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <SectionMarker
        number={active === null ? IDLE_NUMBER : numberFor(active)}
        label={active === null ? IDLE_LABEL : projects[active].title}
      />

      <Notice open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        {toast.title} — download started. Check your downloads folder.
      </Notice>
    </section>
  )
}
