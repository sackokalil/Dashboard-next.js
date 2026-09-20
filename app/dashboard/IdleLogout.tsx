'use client'

import { useEffect } from 'react'
import { logout } from '@/app/lib/actions'

export default function IdleLogout() {

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const resetTimer = () => {
      clearTimeout(timer)

      timer = setTimeout(() => {
        logout()
      }, 15 * 60 * 1000)
    }

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ]

    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timer)

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [])

  return null
}