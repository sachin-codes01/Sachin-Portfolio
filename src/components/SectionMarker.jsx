import { AnimatePresence, motion } from 'motion/react'
import Reveal from './Reveal'

const EASE = [0.22, 1, 0.36, 1]

function Swap({ value, className, style }) {
  return (
    <span className={`relative block overflow-hidden ${className}`} style={style}>
      <span aria-hidden="true" className="invisible block">
        {value}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute inset-0 block whitespace-nowrap"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const labelSize = (label) => `clamp(2.6vw, calc(108vw / ${label.length}), 9vw)`

export default function SectionMarker({ number, label }) {
  return (
    <Reveal from="up" amount={0.25}>
      <div className="flex items-center gap-4 overflow-hidden bg-ink px-5 py-5 text-white md:gap-10 md:px-10 md:py-6">
        <Swap
          value={number}
          className="shrink-0 font-display text-[8vw] leading-none tabular-nums md:text-[9vw]"
        />
        <Swap
          value={label}
          className="ml-auto min-w-0 text-right font-display uppercase leading-none tracking-[-0.01em]"
          style={{ fontSize: labelSize(label) }}
        />
      </div>
    </Reveal>
  )
}
