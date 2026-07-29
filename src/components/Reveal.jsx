import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

const offsets = {
  up: { y: 90, opacity: 0 },
  down: { y: -90, opacity: 0 },
  left: { x: -120, opacity: 0 },
  right: { x: 120, opacity: 0 },
  fade: { opacity: 0 },
  scale: { scale: 0.92, opacity: 0 },
}

export default function Reveal({
  children,
  delay = 0,
  from = 'up',
  as = 'div',
  className = '',
  amount = 0.25,
  duration = 0.9,
}) {
  const Tag = motion[as] ?? motion.div
  const reduced = useReducedMotion()

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      initial={offsets[from] ?? offsets.up}
      whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

export function MaskReveal({ lines, as = 'h2', className = '', delay = 0, stagger = 0.09 }) {
  const Tag = motion[as] ?? motion.h2
  const reduced = useReducedMotion()

  if (reduced) {
    const Plain = as
    return (
      <Plain className={className}>
        {lines.map((line, i) => (
          <span key={typeof line === 'string' ? line : i} className="block">
            {line}
          </span>
        ))}
      </Plain>
    )
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, i) => (
        <span key={typeof line === 'string' ? line : i} className="block overflow-hidden pb-[0.04em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: '110%' },
              show: {
                y: 0,
                transition: { duration: 0.9, delay: delay + i * stagger, ease: EASE },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
