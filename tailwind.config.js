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
      typography: (theme) => {
        // Définition des styles communs pour éviter la répétition
        const commonHeadingStyles = {
          fontWeight: '600',
          color: theme('colors.gray.900'),
          lineHeight: '1.3',
          '&:first-child': {
            marginTop: '0'
          }
        };
        
        const listItemStyles = {
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          paddingLeft: '1.5rem',
          position: 'relative',
          '& > :first-child': {
            marginTop: '0',
          },
          '& > :last-child': {
            marginBottom: '0',
          }
        };
        
        const tableStyles = {
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          borderWidth: '1px',
          borderStyle: 'solid',
          overflow: 'hidden'
        };
        
        const cellStyles = {
          padding: '0.75rem 1rem',
          verticalAlign: 'middle',
          '&:first-child': {
            paddingLeft: '1.5rem',
          },
          '&:last-child': {
            paddingRight: '1.5rem',
          }
        };
        
        return {
          DEFAULT: {
            css: {
              color: theme('colors.gray.800'),
              maxWidth: '65ch',
              fontSize: '1.05rem',
              lineHeight: '1.75',
              
              // Liens
              a: {
                color: theme('colors.blue.600'),
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease-in-out',
                '&:hover': { 
                  color: theme('colors.blue.800'),
                  textDecoration: 'underline' 
                },
              },
              
              // Titres
              h1: {
                ...commonHeadingStyles,
                fontSize: '2.25rem',
                fontWeight: '700',
                marginTop: '2.5rem',
                marginBottom: '1.5rem',
                lineHeight: '1.2',
                letterSpacing: '-0.025em',
              },
              h2: {
                ...commonHeadingStyles,
                fontSize: '1.875rem',
                marginTop: '2.25rem',
                marginBottom: '1.25rem',
                letterSpacing: '-0.015em',
                paddingBottom: '0.5rem',
                borderBottom: `1px solid ${theme('colors.gray.200')}`
              },
              h3: {
                ...commonHeadingStyles,
                fontSize: '1.5rem',
                marginTop: '2rem',
                marginBottom: '1rem',
              },
              h4: {
                ...commonHeadingStyles,
                fontSize: '1.25rem',
                marginTop: '1.75rem',
                marginBottom: '0.75rem',
                lineHeight: '1.4',
              },
              h5: {
                ...commonHeadingStyles,
                fontSize: '1.125rem',
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
                lineHeight: '1.4',
              },
              h6: {
                ...commonHeadingStyles,
                fontSize: '1rem',
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
                lineHeight: '1.4',
              },
              
              // Paragraphes et texte
              p: {
                marginTop: '1.25rem',
                marginBottom: '1.25rem'
              },
              strong: {
                fontWeight: '600',
                color: theme('colors.gray.900')
              },
              
              // Listes
              ul: {
                marginTop: '1.25rem',
                marginBottom: '1.25rem',
                paddingLeft: '1.625rem',
                listStyleType: 'none',
                li: {
                  ...listItemStyles,
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: '0.5rem',
                    height: '0.5rem',
                    top: 'calc(0.875em - 0.1875rem)',
                    left: '0',
                    borderRadius: '50%',
                    backgroundColor: theme('colors.blue.500')
                  }
                },
                'ul, ol': {
                  marginTop: '0.75rem',
                  marginBottom: '0.75rem',
                  paddingLeft: '1.25rem'
                }
              },
              ol: {
                marginTop: '1.25rem',
                marginBottom: '1.25rem',
                paddingLeft: '1.625rem',
                counterReset: 'item',
                listStyleType: 'none',
                li: {
                  ...listItemStyles,
                  counterIncrement: 'item',
                  '&:before': {
                    content: 'counter(item) "."',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    fontWeight: '600',
                    color: theme('colors.blue.600')
                  }
                },
                'ul, ol': {
                  marginTop: '0.75rem',
                  marginBottom: '0.75rem',
                  paddingLeft: '1.25rem'
                }
              },
              
              // Code
              code: {
                fontSize: '0.9em',
                fontWeight: '500',
                fontFamily: theme('fontFamily.mono').join(', '),
                backgroundColor: theme('colors.gray.100'),
                padding: '0.2em 0.4em',
                borderRadius: theme('borderRadius.md'),
                border: `1px solid ${theme('colors.gray.200')}`,
                color: theme('colors.blue.700')
              },
              'pre code': {
                backgroundColor: 'transparent',
                borderRadius: '0',
                border: 'none',
                padding: '0',
                fontWeight: '400',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                lineHeight: 'inherit'
              },
              pre: {
                color: theme('colors.gray.200'),
                backgroundColor: theme('colors.gray.800'),
                fontFamily: theme('fontFamily.mono').join(', '),
                borderRadius: theme('borderRadius.lg'),
                padding: '1rem 1.5rem',
                overflowX: 'auto',
                border: `1px solid ${theme('colors.gray.700')}`,
                fontSize: '0.9rem',
                lineHeight: '1.7',
                marginTop: '1.5rem',
                marginBottom: '1.5rem'
              },
              
              // Citations
              blockquote: {
                fontWeight: '500',
                fontStyle: 'italic',
                color: theme('colors.gray.700'),
                borderLeftWidth: '0.25rem',
                borderLeftColor: theme('colors.blue.400'),
                quotes: '"\\201C""\\201D""\\2018""\\2019"',
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
                paddingLeft: '1.5rem',
                p: {
                  marginTop: '0.75rem',
                  marginBottom: '0.75rem'
                },
                ul: {
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  li: {
                    '&:before': {
                      backgroundColor: theme('colors.blue.300')
                    }
                  }
                },
                ol: {
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  li: {
                    '&:before': {
                      color: theme('colors.blue.400')
                    }
                  }
                }
              },
              
              // Style pour les listes de premier niveau avec icônes plus visibles
              '> ul': {
                li: {
                  '&:before': {
                    width: '0.6rem',
                    height: '0.6rem',
                    backgroundColor: theme('colors.blue.600'),
                    boxShadow: '0 0 3px rgba(37, 99, 235, 0.3)'
                  }
                }
              },
              
              // Style pour les check-lists
              '.checklist': {
                listStyleType: 'none',
                paddingLeft: '1.75rem',
                li: {
                  position: 'relative',
                  paddingLeft: '1.5rem',
                  marginBottom: '0.5rem',
                  '&:before': {
                    content: '"✓"',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    color: theme('colors.green.500'),
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }
                }
              },
              
              // Tableaux
              table: {
                ...tableStyles,
                fontSize: '0.95rem',
                lineHeight: '1.5',
                marginTop: '2rem',
                marginBottom: '2rem',
                borderColor: theme('colors.gray.300'),
                borderRadius: theme('borderRadius.lg'),
                boxShadow: theme('boxShadow.sm'),
              },
              thead: {
                backgroundColor: theme('colors.gray.100'),
                borderBottomWidth: '2px',
                borderBottomColor: theme('colors.gray.300'),
                borderBottomStyle: 'solid',
                th: {
                  ...cellStyles,
                  color: theme('colors.gray.800'),
                  fontWeight: '600',
                  fontSize: '0.95rem',
                }
              },
              tbody: {
                tr: {
                  borderBottomWidth: '1px',
                  borderBottomColor: theme('colors.gray.200'),
                  '&:last-child': {
                    borderBottomWidth: '0'
                  },
                  '&:nth-child(even)': {
                    backgroundColor: theme('colors.gray.50')
                  },
                  '&:hover': {
                    backgroundColor: theme('colors.blue.50')
                  }
                },
                td: cellStyles
              },
              
              // Ligne horizontale
              hr: {
                marginTop: '3rem',
                marginBottom: '3rem',
                borderColor: theme('colors.gray.200')
              },
              
              // Images
              img: {
                marginTop: '2rem',
                marginBottom: '2rem',
                borderRadius: theme('borderRadius.lg'),
                boxShadow: theme('boxShadow.md')
              },
              
              // Notes de bas de page
              '.footnotes': {
                fontSize: '0.875rem',
                color: theme('colors.gray.600'),
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${theme('colors.gray.200')}`,
                ol: {
                  marginTop: '1rem'
                },
                p: {
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem'
                }
              },
            }
          },
          dark: {
            css: {
              color: theme('colors.gray.300'),
              
              a: {
                color: theme('colors.blue.400'),
                '&:hover': { 
                  color: theme('colors.blue.300')
                },
              },
              
              // Titres en mode sombre
              h1: { color: theme('colors.white') },
              h2: { 
                color: theme('colors.white'),
                borderBottomColor: theme('colors.gray.700')
              },
              h3: { color: theme('colors.white') },
              h4: { color: theme('colors.white') },
              h5: { color: theme('colors.white') },
              h6: { color: theme('colors.white') },
              
              strong: { 
                color: theme('colors.blue.300')
              },
              
              // Listes en mode sombre
              ul: {
                li: {
                  '&:before': {
                    backgroundColor: theme('colors.blue.400'),
                    boxShadow: '0 0 2px rgba(59, 130, 246, 0.5)'
                  }
                }
              },
              ol: {
                li: {
                  '&:before': { 
                    color: theme('colors.blue.400'),
                    fontWeight: '600'
                  }
                }
              },
              
              // Code en mode sombre
              code: {
                backgroundColor: theme('colors.gray.800'),
                color: theme('colors.blue.300'),
                border: `1px solid ${theme('colors.gray.700')}`
              },
              pre: {
                color: theme('colors.gray.200'),
                backgroundColor: theme('colors.gray.900'),
                border: `1px solid ${theme('colors.gray.800')}`
              },
              
              // Citations en mode sombre
              blockquote: {
                color: theme('colors.gray.300'),
                borderLeftColor: theme('colors.blue.500')
              },
              
              // Tableaux en mode sombre
              table: {
                borderColor: theme('colors.gray.700'),
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
              },
              thead: {
                backgroundColor: theme('colors.gray.800'),
                borderBottomColor: theme('colors.blue.700'),
                th: { color: theme('colors.gray.100') }
              },
              tbody: {
                tr: {
                  borderBottomColor: theme('colors.gray.700'),
                  '&:nth-child(even)': {
                    backgroundColor: 'rgba(17, 24, 39, 0.4)'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.3)'
                  }
                },
                td: { borderColor: theme('colors.gray.700') }
              },
              
              hr: { borderColor: theme('colors.gray.700') },
              
              img: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)'
              },
              
              '.footnotes': {
                color: theme('colors.gray.400'),
                borderTopColor: theme('colors.gray.700')
              },
            }
          }
        };
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addComponents, theme }) {
      // Styles communs pour réduire la duplication
      const bulletListBase = {
        position: 'relative',
        paddingLeft: '1.5rem',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '0',
          top: '0.625em',
          height: '0.375em',
          width: '0.375em',
          borderRadius: '50%'
        }
      };
      
      const tableBase = {
        borderCollapse: 'separate',
        borderSpacing: '0',
        width: '100%',
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: theme('borderRadius.lg'),
        overflow: 'hidden',
        
        'th, td': {
          padding: '0.75rem 1rem',
          textAlign: 'left',
          verticalAlign: 'middle'
        }
      };
      
      const theadBase = {
        'th': {
          fontWeight: '600'
        }
      };
      
      const tableRowBase = {
        borderBottomWidth: '1px',
        
        '&:last-child': {
          borderBottomWidth: '0'
        }
      };
      
      const components = {
        // Améliorations des puces dans la prose
        '.prose-bullets ul li': {
          ...bulletListBase,
          '&::before': {
            ...bulletListBase['&::before'],
            backgroundColor: theme('colors.blue.500')
          }
        },
        '.prose-bullets-blue ul li::before': {
          backgroundColor: theme('colors.blue.500')
        },
        '.prose-bullets-green ul li::before': {
          backgroundColor: theme('colors.green.500')
        },
        
        // Listes de tâches
        '.prose-tasks ul': {
          listStyleType: 'none',
          paddingLeft: '1.75rem',
          'li': {
            position: 'relative',
            paddingLeft: '1.75rem',
            marginBottom: '0.5rem',
            '&::before': {
              content: '"✓"',
              position: 'absolute',
              left: '0',
              color: theme('colors.green.500'),
              fontWeight: 'bold'
            }
          }
        },
        
        // Listes numérotées colorées
        '.prose-numbers ol li::before': {
          color: theme('colors.blue.600'),
          fontWeight: 'bold'
        },
        
        // Tables améliorées
        '.table-enhanced': {
          ...tableBase,
          borderColor: theme('colors.gray.300'),
          boxShadow: theme('boxShadow.sm'),
          
          'thead': {
            ...theadBase,
            backgroundColor: theme('colors.gray.100'),
            borderBottomWidth: '2px',
            borderBottomColor: theme('colors.gray.300'),
            
            'th': {
              color: theme('colors.gray.800')
            }
          },
          
          'tbody tr': {
            ...tableRowBase,
            borderBottomColor: theme('colors.gray.200'),
            
            '&:nth-child(even)': {
              backgroundColor: theme('colors.gray.50')
            },
            
            '&:hover': {
              backgroundColor: theme('colors.blue.50')
            }
          }
        },
        
        // Variantes de tables
        '.table-compact': {
          'th, td': {
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem'
          }
        },
        
        '.table-bordered': {
          'th, td': {
            borderWidth: '1px',
            borderColor: theme('colors.gray.300')
          }
        },
        
        '.table-striped tbody tr': {
          '&:nth-child(odd)': {
            backgroundColor: theme('colors.gray.50')
          }
        },
        
        '.table-primary thead': {
          backgroundColor: theme('colors.blue.100'),
          borderBottomColor: theme('colors.blue.300'),
          'th': {
            color: theme('colors.blue.900')
          }
        },
        
        '.table-cells-rounded th, .table-cells-rounded td': {
          borderRadius: theme('borderRadius.md'),
          margin: '2px',
          backgroundColor: theme('colors.white')
        },
        '.table-cells-rounded thead th': {
          backgroundColor: theme('colors.gray.100')
        },
        
        // Thème sombre pour les tables
        '.dark .table-enhanced': {
          borderColor: theme('colors.gray.700'),
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          
          'thead': {
            backgroundColor: theme('colors.gray.800'),
            borderBottomColor: theme('colors.gray.600'),
            'th': { 
              color: theme('colors.white')
            }
          },
          
          'tbody tr': {
            borderBottomColor: theme('colors.gray.700'),
            '&:nth-child(even)': {
              backgroundColor: 'rgba(17, 24, 39, 0.4)'
            },
            '&:hover': {
              backgroundColor: 'rgba(30, 58, 138, 0.3)'
            }
          },
          
          'td': {
            color: theme('colors.gray.300')
          }
        },
        
        '.dark .table-primary thead': {
          backgroundColor: theme('colors.blue.900'),
          borderBottomColor: theme('colors.blue.700'),
          'th': {
            color: theme('colors.white')
          }
        },
        
        '.dark .table-striped tbody tr:nth-child(odd)': {
          backgroundColor: 'rgba(17, 24, 39, 0.4)'
        },
        
        '.dark .table-cells-rounded th, .dark .table-cells-rounded td': {
          backgroundColor: theme('colors.gray.800')
        },
        
        '.dark .table-cells-rounded thead th': {
          backgroundColor: theme('colors.gray.900'),
          color: theme('colors.white')
        }
      };
      
      addComponents(components);
    }
  ]
} 