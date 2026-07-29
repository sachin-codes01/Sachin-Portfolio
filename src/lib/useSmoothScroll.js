import { useEffect } from 'react'
import Lenis from 'lenis'

let current = null
const listeners = new Set()

export function setScrollLocked(locked) {
  if (!current) return
  if (locked) current.stop()
  else current.start()
}

export function onPageScroll(callback) {
  listeners.add(callback)
  window.addEventListener('scroll', callback, { passive: true })
  return () => {
    listeners.delete(callback)
    window.removeEventListener('scroll', callback)
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 0.9 })
    current = lenis
    lenis.on('scroll', () => listeners.forEach((fn) => fn()))
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]')
      if (!anchor) return
      const target = document.querySelector(anchor.getAttribute('href'))
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -8 })
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
      current = null
    }
  }, [])
}
