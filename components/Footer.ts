import { html } from '@mastrojs/mastro'

export const Footer = () =>
  html`
    <footer>
      <div>
        Build with Mastro
        <a href="https://github.com/mastrojs/mastro">from GitHub</a>.
        © ${new Date().getFullYear()}
      <div>
    </footer>
  `
