import type { Config } from 'tailwindcss'
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-inter)',
  				'sans-serif'
  			]
  		},
  		colors: {
  			'brand-bg': 'var(--color-bg)',
  			'brand-surface': 'var(--color-surface)',
  			'brand-border': 'var(--color-border)',
  			'brand-primary': 'var(--color-primary)',
  			'brand-secondary': 'var(--color-secondary)',
  			'brand-accent': 'var(--color-accent)',
  			'brand-text-primary': 'var(--color-text-primary)',
  			'brand-text-secondary': 'var(--color-text-secondary)',
  			'brand-insight': '#38BDF8',
  			'brand-suggestion': '#8B5CF6',
  			'brand-success': '#10B981',
  			'brand-warning': '#F59E0B',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'glow-sm': 'none',
  			'glow-md': 'none',
  			'glow-lg': 'none',
  			none: 'none'
  		},
  		animation: {
  			'page-enter': 'pageEnter 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  			'modal-fade-in': 'modalFadeIn 0.2s ease-out',
  			'modal-slide-down': 'modalSlideDown 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
  			'search-backdrop-in': 'search-backdrop-in 0.3s ease-out forwards',
  			'search-backdrop-out': 'search-backdrop-out 0.3s ease-out forwards',
  			'search-modal-in': 'search-modal-in 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
  			'search-modal-out': 'search-modal-out 0.3s ease-out forwards',
  			'toast-in': 'toastIn 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  			'toast-out': 'toastOut 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  			'pulse-dot': 'pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'liquid-pan': 'liquid-pan 15s ease infinite'
  		},
  		keyframes: {
  			pageEnter: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(15px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			modalFadeIn: {
  				'0%': {
  					backgroundColor: 'rgba(0,0,0,0)'
  				},
  				'100%': {
  					backgroundColor: 'rgba(0,0,0,0.6)'
  				}
  			},
  			modalSlideDown: {
  				'0%': {
  					transform: 'translateY(-20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'search-backdrop-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'search-backdrop-out': {
  				'0%': {
  					opacity: '1'
  				},
  				'100%': {
  					opacity: '0'
  				}
  			},
  			'search-modal-in': {
  				'0%': {
  					transform: 'translateY(-20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'search-modal-out': {
  				'0%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateY(-20px)',
  					opacity: '0'
  				}
  			},
  			toastIn: {
  				'0%': {
  					transform: 'translateY(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			toastOut: {
  				'0%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateY(100%)',
  					opacity: '0'
  				}
  			},
  			'pulse-dot': {
  				'0%, 100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				},
  				'50%': {
  					transform: 'scale(1.25)',
  					opacity: '0.75'
  				}
  			},
  			'liquid-pan': {
  				'0%': {
  					backgroundPosition: '0% 50%'
  				},
  				'25%': {
  					backgroundPosition: '100% 0%'
  				},
  				'50%': {
  					backgroundPosition: '100% 100%'
  				},
  				'75%': {
  					backgroundPosition: '0% 100%'
  				},
  				'100%': {
  					backgroundPosition: '0% 50%'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
}
export default config
