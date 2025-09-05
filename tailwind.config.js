module.exports = {
    content: ['storyblok/**/*.{vue,js}', 'components/**/*.{vue,js}', 'pages/**/*.vue'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                display: ['Mrs Saint Delafield', 'cursive'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5' }],
                'sm': ['0.875rem', { lineHeight: '1.5' }],
                'base': ['1rem', { lineHeight: '1.6' }],
                'lg': ['1.125rem', { lineHeight: '1.6' }],
                'xl': ['1.25rem', { lineHeight: '1.5' }],
                '2xl': ['1.5rem', { lineHeight: '1.4' }],
                '3xl': ['1.875rem', { lineHeight: '1.3' }],
                '4xl': ['2.25rem', { lineHeight: '1.2' }],
                '5xl': ['3rem', { lineHeight: '1.1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['8rem', { lineHeight: '1' }],
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },
            lineHeight: {
                tight: '1.25',
                snug: '1.375',
                normal: '1.5',
                relaxed: '1.625',
                loose: '2',
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0em',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em',
            },
            spacing: {
                '0': '0px',
                '1': '0.25rem',   // 4px
                '2': '0.5rem',    // 8px
                '3': '0.75rem',   // 12px
                '4': '1rem',      // 16px
                '5': '1.25rem',   // 20px
                '6': '1.5rem',    // 24px
                '8': '2rem',      // 32px
                '10': '2.5rem',   // 40px
                '12': '3rem',     // 48px
                '16': '4rem',     // 64px
                '20': '5rem',     // 80px
                '24': '6rem',     // 96px
                '32': '8rem',     // 128px
                '40': '10rem',    // 160px
                '48': '12rem',    // 192px
                '56': '14rem',    // 224px
                '64': '16rem',    // 256px
                '80': '20rem',    // 320px
                '96': '24rem',    // 384px
                '128': '32rem',   // 512px
                '144': '36rem',   // 576px - Hero section spacing
                '160': '40rem',   // 640px - Large section spacing
                '192': '48rem',   // 768px - Massive section spacing
                '256': '64rem',   // 1024px - Ultra-wide spacing
            },
            maxWidth: {
                'xs': '20rem',     // 320px
                'sm': '24rem',     // 384px
                'md': '28rem',     // 448px
                'lg': '32rem',     // 512px
                'xl': '36rem',     // 576px
                '2xl': '42rem',    // 672px
                '3xl': '48rem',    // 768px
                '4xl': '56rem',    // 896px
                '5xl': '64rem',    // 1024px
                '6xl': '72rem',    // 1152px
                '7xl': '80rem',    // 1280px
                'full': '100%',
                'min': 'min-content',
                'max': 'max-content',
                'fit': 'fit-content',
                'prose': '65ch',
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '1.5rem',
                    md: '2rem',
                    lg: '3rem',
                    xl: '4rem',
                    '2xl': '5rem',
                },
                screens: {
                    sm: '640px',
                    md: '768px',
                    lg: '1024px',
                    xl: '1280px',
                    '2xl': '1400px',
                },
            },
            // Custom Grid System
            gridTemplateColumns: {
                'luxury-12': 'repeat(12, minmax(0, 1fr))',
                'luxury-8': 'repeat(8, minmax(0, 1fr))',
                'luxury-6': 'repeat(6, minmax(0, 1fr))',
                'luxury-4': 'repeat(4, minmax(0, 1fr))',
                'luxury-3': 'repeat(3, minmax(0, 1fr))',
                'luxury-2': 'repeat(2, minmax(0, 1fr))',
            },
            gap: {
                'luxury-xs': '0.75rem',   // 12px
                'luxury-sm': '1rem',      // 16px
                'luxury-md': '1.25rem',   // 20px
                'luxury-lg': '1.5rem',    // 24px
                'luxury-xl': '2rem',      // 32px
                'luxury-2xl': '2.5rem',   // 40px
                'luxury-3xl': '3rem',     // 48px
            },
            colors: {
                // Primary Colors -  Blue Palette
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c7d6ff',
                    300: '#a5b8ff',
                    400: '#8190ff',
                    500: '#718FCB', // Main brand color
                    600: '#5a73b8',
                    700: '#4a5fa3',
                    800: '#3d4f8e',
                    900: '#34417a',
                    950: '#1f2a4a',
                },
                // Secondary Colors -  Teal Palette
                secondary: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#50b0ae', // Main secondary color
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                // Neutral Grays with Warm Undertones
                neutral: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                },
                // Accent Colors for Highlights
                accent: {
                    gold: {
                        50: '#fffbeb',
                        100: '#fef3c7',
                        200: '#fde68a',
                        300: '#fcd34d',
                        400: '#fbbf24',
                        500: '#f59e0b',
                        600: '#d97706',
                        700: '#b45309',
                        800: '#92400e',
                        900: '#78350f',
                    },
                    rose: {
                        50: '#fff1f2',
                        100: '#ffe4e6',
                        200: '#fecdd3',
                        300: '#fda4af',
                        400: '#fb7185',
                        500: '#f43f5e',
                        600: '#e11d48',
                        700: '#be123c',
                        800: '#9f1239',
                        900: '#881337',
                    },
                },
                // Semantic Colors
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                background: {
                    primary: '#ffffff',
                    secondary: '#fafaf9',
                    tertiary: '#f5f5f4',
                    dark: '#1c1917',
                },
                text: {
                    primary: '#1c1917',
                    secondary: '#44403c',
                    tertiary: '#78716c',
                    inverse: '#ffffff',
                    muted: '#a8a29e',
                },
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                'none': 'none',
            },
            animation: {
                'spin': 'spin 1s linear infinite',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce': 'bounce 1s infinite',
            },
            // Section Spacing Utilities
            sectionSpacing: {
                'hero': '144px',      // 36rem - Hero sections
                'major': '96px',      // 24rem - Major sections
                'content': '64px',    // 16rem - Content sections
                'component': '32px',  // 8rem - Component spacing
                'card': '24px',       // 6rem - Card spacing
                'tight': '16px',      // 4rem - Tight spacing
            },
            // Additional responsive breakpoints (extends default)
            screens: {
                'xs': '475px',
                '3xl': '1600px',
            },
        },
    },
}