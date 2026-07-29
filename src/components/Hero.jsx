import Button from '@mui/material/Button'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { hero } from '../data/site'

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
        <h1 className="font-display text-mega tracking-[-0.02em]">
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

        <div className="mt-8 flex flex-col gap-6 md:mt-12 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="max-w-xs text-[15px] leading-relaxed text-ink/70"
          >
            {hero.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.7 }}
          >
            <Button
              href="#contact"
              variant="outlined"
              color="primary"
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: 'rgba(11,11,11,0.3)',
                '&:hover': { borderColor: '#0b0b0b', background: '#0b0b0b', color: '#fff' },
              }}
            >
              Connect
            </Button>
          </motion.div>
        </div>
      </div>

      <div ref={bandRef} className="relative h-[46vh] overflow-hidden bg-sand md:h-[68vh]">
        <motion.img
          src={hero.portrait}
          alt="Portrait of the studio lead"
          style={{ y }}
          className="absolute inset-0 size-full scale-[1.16] object-cover"
          loading="eager"
        />
      </div>
    </section>
  )
}
