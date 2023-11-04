import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      opacity: {
        2: '0.02',
        4: '0.04',
        12: '0.12',
      },
      maxWidth: {
        '8xl': '1920px',
      },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [require('daisyui')],
  daisyui: {
    theme: ['dark'],
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#24a0ed',
          'primary-focus': '#24a0ed',
          'primary-content': '#FFFFFF',

          secondary: '#D926A9',
          'secondary-focus': '#BA2191',
          'secondary-content': '#FFFFFF',

          accent: '#1FB2A6',
          'accent-focus': '#1A9389',
          'accent-content': '#FFFFFF',

          neutral: '#2a323c',
          'neutral-focus': '#242b33',
          'neutral-content': '#A6ADBB',
          'base-100': '#222831',
          'base-200': '#212730',
          'base-300': '#15191e',
          'base-content': '#ffffff',

          info: '#3ABFF8',
          'info-content': '#002B3D',

          success: '#418E60',
          'success-content': '#003320',

          warning: '#FBBD23',
          'warning-content': '#003320',

          error: '#8E4141',
          'error-content': '#470000',
        },
      },
    ],
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
}
export default config
