'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorContextType {
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function useErrorContext() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorContextProvider')
  }
  return context
}

interface ErrorContextProviderProps {
  children: ReactNode
}

export function ErrorContextProvider({ children }: ErrorContextProviderProps) {
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const value = {
    error,
    setError,
    clearError,
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}