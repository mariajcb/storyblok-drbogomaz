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
                'luxury-sm': '28rem',   // 448px - Small luxury containers
                'luxury-md': '48rem',   // 768px - Medium luxury containers
                'luxury-lg': '64rem',   // 1024px - Large luxury containers
                'luxury-xl': '80rem',   // 1280px - Extra large luxury containers
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                    '2xl': '6rem',
                },
                screens: {
                    sm: '640px',
                    md: '768px',
                    lg: '1024px',
                    xl: '1280px',
                    '2xl': '1400px',
                },
            },
        },
    },
}