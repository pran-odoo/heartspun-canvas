import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					deep: 'hsl(var(--primary-deep))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				romantic: {
					DEFAULT: 'hsl(var(--romantic))',
					soft: 'hsl(var(--romantic-soft))',
					deep: 'hsl(var(--romantic-deep))'
				},
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					soft: 'hsl(var(--gold-soft))',
					deep: 'hsl(var(--gold-deep))'
				},
				glass: {
					DEFAULT: 'hsl(var(--glass))',
					border: 'hsl(var(--glass-border))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'33%': { transform: 'translateY(-20px) rotate(1deg)' },
					'66%': { transform: 'translateY(-10px) rotate(-1deg)' }
				},
				'sparkle': {
					'0%': { opacity: '1', transform: 'scale(0) rotate(0deg)' },
					'50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
					'100%': { opacity: '0', transform: 'scale(0) rotate(360deg)' }
				},
				'heart-float': {
					'0%': { opacity: '0', transform: 'translateY(0) scale(0) rotate(0deg)' },
					'20%': { opacity: '1', transform: 'translateY(-20px) scale(1) rotate(10deg)' },
					'100%': { opacity: '0', transform: 'translateY(-200px) scale(0.5) rotate(30deg)' }
				},
				'star-twinkle': {
					'0%, 100%': { opacity: '0.3', transform: 'scale(1) rotate(0deg)' },
					'50%': { opacity: '1', transform: 'scale(1.5) rotate(180deg)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'pulse-romantic': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--romantic) / 0.7)' },
					'70%': { boxShadow: '0 0 0 20px hsl(var(--romantic) / 0)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-delayed': 'float 8s ease-in-out infinite 2s',
				'sparkle': 'sparkle 1.5s ease-out forwards',
				'heart-float': 'heart-float 4s ease-out forwards',
				'star-twinkle': 'star-twinkle 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 15s ease-in-out infinite',
				'pulse-romantic': 'pulse-romantic 4s ease-in-out infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite'
			},
			fontFamily: {
				'romantic': ['Playfair Display', 'serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
