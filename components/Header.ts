import { html } from '@mastrojs/mastro'

export const Header = () => html`
  <header>
    <div class="text-xl">My awesome website</div>
    <nav>
      <a href="/" class="btn btn-xs btn-primary">Home</a>
      <a href="/about" class="btn btn-xs btn-primary">About</a>
    </nav>
  </header>
`
