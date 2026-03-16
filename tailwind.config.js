/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        bg:      '#000000',
        s0:      '#1c1c1e',
        s1:      '#2c2c2e',
        s2:      '#3a3a3c',
        border:  '#38383a',
        muted:   '#636366',
        sub:     '#8e8e93',
        acc:     '#0a84ff',
        accSoft: 'rgba(10,132,255,0.15)',
        red:     '#ff453a',
        redSoft: 'rgba(255,69,58,0.15)',
        green:   '#30d158',
        com:     '#8e8e93',
        rar:     '#0a84ff',
        leg:     '#ff9f0a',
        dia:     '#bf5af2',
      },
      borderRadius: {
        ios: '13px',
        'ios-lg': '18px',
      },
    },
  },
  plugins: [],
}
