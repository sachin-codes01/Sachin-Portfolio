import Button from '@mui/material/Button'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { hero } from '../data/site'

const outlineButton = {
  borderColor: 'color-mix(in srgb, var(--mui-palette-text-primary) 30%, transparent)',
  color: 'var(--mui-palette-text-primary)',
  '&:hover': {
    borderColor: 'var(--mui-palette-text-primary)',
    background: 'var(--mui-palette-text-primary)',
    color: 'var(--mui-palette-background-default)',
  },
}

const rise = {
  hidden: { y: '110%' },
  show: (i) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.19, 1, 0.22, 1] },
  }),
}

export default function Hero() {
  const bandRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-375 px-5 pt-28 pb-10 md:px-10 md:pt-36 md:pb-14">
        <h1 className="font-display text-mega tracking-[-0.02em] select-none">
          <span className="block overflow-hidden pb-[0.04em] text-[0.42em]">
            <motion.span custom={0} variants={rise} initial="hidden" animate="show" className="block">
              {hero.owner}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block">
              {hero.title}
            </motion.span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-5 md:mt-12 sm:flex-row sm:items-end sm:gap-7">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="max-w-xs text-[15px] leading-relaxed text-ink/70 select-none"
          >
            {hero.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.p>

          <motion.div
            data-tree-ground-sm
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.7 }}
            className="shrink-0"
          >
            <Button
              href="#contact"
              variant="outlined"
              color="primary"
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
              sx={outlineButton}
            >
              Connect
            </Button>
          </motion.div>
        </div>
      </div>

      <div
        ref={bandRef}
        data-tree-ground
        className="band [--band:var(--color-sand)] h-[46vh] overflow-hidden md:h-[68vh]"
      >
        <motion.img
          src={hero.portrait}
          alt="Portrait of the studio lead"
          style={{ y }}
          className="absolute inset-0 z-[-2] size-full scale-[1.16] object-cover"
          loading="eager"
        />
      </div>
    </section>
  )
}
