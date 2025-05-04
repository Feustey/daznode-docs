module.exports = {
  content: [
    "./_layouts/**/*.{njk,html}",
    "./_includes/**/*.njk",
    "./index.md",
    "./basics/**/*.md",
    "./concepts-avances/**/*.md",
    "./faq-glossaire/**/*.md",
    "./rag/**/*.md",
    "./reference-technique/**/*.md",
    "./tutoriels/**/*.md"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00b1ff',
          dark: '#008fd1'
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['SFMono-Regular','Menlo','monospace']
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': { color: theme('colors.primary.dark') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.900')
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: theme('borderRadius.sm')
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0
            }
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': { color: theme('colors.blue.300') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.white')
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200')
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.gray.600')
            },
            hr: {
              borderColor: theme('colors.gray.700')
            },
            ol: {
              li: {
                '&:before': { color: theme('colors.gray.400') }
              }
            },
            ul: {
              li: {
                '&:before': { backgroundColor: theme('colors.gray.400') }
              }
            },
            strong: { color: theme('colors.gray.100') },
            thead: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.600')
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700')
              }
            }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
} 