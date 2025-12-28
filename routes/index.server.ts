import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '../components/Layout.js'

const buildChildren = () => {
  return html`
    <h1>Home</h1>
    <ul>
      <li>
        <a href="/gallery/" class="link link-tertiary underline">
          Recent photos
        </a>
      </li>
    </ul>
  `
}

export const GET = async () => {
  return htmlToResponse(
    Layout({
      title: 'Home',
      children: buildChildren(),
    })
  )
}
