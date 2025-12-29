import { html } from '@mastrojs/mastro'

export const Header = () => html`
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">My Awesome Website</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About</a></li>
      </ul>
    </div>
  </div>
`
