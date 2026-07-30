import { useEffect, useState } from 'react'

const STORAGE_KEY = 'leavesPaused'

export function useLeavesPaused() {
  const [paused, setPaused] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(paused))
  }, [paused])

  return [paused, setPaused]
}
