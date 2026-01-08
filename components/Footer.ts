import { html } from '@mastrojs/mastro'

export const Footer = () => html`
  <footer
    class="footer footer-center p-10 bg-base-300 text-base-content rounded"
  >
    <aside>
      <p>
        Copyright Chris Sterritt © ${new Date().getFullYear()} - All rights
        reserved
      </p>
    </aside>
  </footer>
`
