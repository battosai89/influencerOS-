import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import ErrorBoundary from '../components/ErrorBoundary'
import { ErrorContextProvider } from '@/contexts/ErrorContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'InfluencerOS',
  description: 'The AI-powered OS for Modern Influencer Agencies.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" data-accent="purple">
      <head>
        {/* The theme-flash prevention script */}
        <Script 
          id="theme-switcher" 
          strategy="beforeInteractive"
        >
          {`
            
          `}
        </Script>
        {/* Fallback inline script for immediate theme application */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              
            `
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-brand-bg`}>
        <ErrorContextProvider>
          <ErrorBoundary>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ErrorBoundary>
        </ErrorContextProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}
