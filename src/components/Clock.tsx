'use client'

import { useState, useEffect } from 'react'

interface ClockProps {
  className?: string
  showSeconds?: boolean
  format?: '12' | '24'
  showDate?: boolean // New: Optional date display
  timeZone?: string // New: Optional timezone support
}

const Clock: React.FC<ClockProps> = ({
  className = '',
  showSeconds = false,
  format = '12',
  showDate = false,
  timeZone
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: format === '12',
      timeZone: timeZone
    }

    return date.toLocaleTimeString('en-US', options)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timeZone
    }

    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className={`hidden sm:block ${className}`}>
      <div className="flex flex-col items-center space-y-1 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        {/* Time Display */}
        <div className="text-[var(--color-text-primary)] font-mono text-lg font-semibold">
          {formatTime(currentTime)}
        </div>

        {/* Date Display (conditional) */}
        {showDate && (
          <div className="text-[var(--color-text-secondary)] text-sm">
            {formatDate(currentTime)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Clock
