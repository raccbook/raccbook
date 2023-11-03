import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [require('daisyui')],
  daisyui: {
    // themes: ['light', 'dark'],
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],

          primary: '#6E0B75',
          'primary-focus': '#4F0854',
          'primary-content': '#E3CEE2',

          secondary: '#007EBD',
          'secondary-focus': '#006699',
          'secondary-content': '#D8E5F3',

          accent: '#F8860D',
          'accent-focus': '#DA7407',
          'accent-content': '#301D0D',

          neutral: '#1F2937',
          'neutral-focus': '#121821',
          'neutral-content': '#CED0D4',
          'base-100': '#FFFFFF',
          'base-200': '#EDEDED',
          'base-300': '#DBDBDB',
          'base-content': '#1F2937',

          info: '#3ABFF8',
          'info-content': '#002B3D',

          success: '#36D399',
          'success-content': '#003320',

          warning: '#FBBD23',
          'warning-content': '#003320',

          error: '#F87272',
          'error-content': '#470000',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#00ADB5',
          'primary-focus': '#5616C5',
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
          'base-200': '#191e24',
          'base-300': '#15191e',
          'base-content': '#A6ADBB',

          info: '#3ABFF8',
          'info-content': '#002B3D',

          success: '#36D399',
          'success-content': '#003320',

          warning: '#FBBD23',
          'warning-content': '#003320',

          error: '#F87272',
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
