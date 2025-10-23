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

const themeScript = `\n            try {\n              const prefsJSON = localStorage.getItem('InfluencerOS_user_prefs');\n              if (prefsJSON) {\n                  const prefs = JSON.parse(prefsJSON);\n                  if (prefs.theme === 'light') {\n                      document.documentElement.classList.remove('dark');\n                  }\n                  if (prefs.accentColor) {\n                      document.documentElement.style.setProperty('--color-primary', \`var(--color-\${prefs.accentColor})\`);\n                      document.documentElement.style.setProperty('--color-accent-gradient', \`var(--gradient-\${prefs.accentColor})\`);\n                  }\n              }\n            } catch (e) {\n              console.error('Failed to apply theme from localStorage', e);\n            }\n          `;

const fallbackScript = `\n              (function() {\n                try {\n                  const prefsJSON = localStorage.getItem('InfluencerOS_user_prefs');\n                  if (prefsJSON) {\n                      const prefs = JSON.parse(prefsJSON);\n                      if (prefs.theme === 'light') {\n                          document.documentElement.classList.remove('dark');\n                      }\n                      if (prefs.accentColor) {\n                          document.documentElement.style.setProperty('--color-primary', \`var(--color-\${prefs.accentColor})\`);\n                          document.documentElement.style.setProperty('--color-accent-gradient', \`var(--gradient-\${prefs.accentColor})\`);\n                      }\n                  }\n                } catch (e) {\n                  console.error('Failed to apply theme from localStorage', e);\n                }\n              })();\n            `;

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
          {themeScript}
        </Script>
        {/* Fallback inline script for immediate theme application */}
        <script
          dangerouslySetInnerHTML={{
            __html: fallbackScript
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
