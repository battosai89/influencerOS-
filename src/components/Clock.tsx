'use client'

import { useState, useEffect } from 'react'

interface ClockProps {
  className?: string
  showSeconds?: boolean
  format?: '12' | '24'
}

const Clock: React.FC<ClockProps> = ({
  className = '',
  showSeconds = false,
  format = '12'
}) => {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    if (format === '24') {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
    } else {
      const hours = ((date.getHours() + 11) % 12 + 1).toString()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
      return showSeconds
        ? `${hours}:${minutes}:${seconds} ${ampm}`
        : `${hours}:${minutes} ${ampm}`
    }
  }

  return (
    <div className={`font-mono text-sm ${className}`}>
      {formatTime(time)}
    </div>
  )
}

export default Clock
