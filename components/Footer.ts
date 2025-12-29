import { html } from '@mastrojs/mastro'

export const Footer = () => html`
  <footer
    class="footer footer-center p-10 bg-base-300 text-base-content rounded"
  >
    <aside>
      <p>
        Built with
        <a
          href="https://github.com/mastrojs/mastro"
          class="link link-hover font-bold"
          >Mastro</a
        >. <br />
        Copyright Chris Sterritt © ${new Date().getFullYear()} - All rights
        reserved
      </p>
    </aside>
  </footer>
`
