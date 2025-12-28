import { html, htmlToResponse } from '@mastrojs/mastro'
import { readMarkdownFiles } from '@mastrojs/markdown'
import { Layout } from '../components/Layout.js'

const buildChildren = () => {
  return html`
    <h1>Gallery Index</h1>
    <p>Explore our photo galleries:</p>
    <ul>
      <li><a href="/gallery/vancouver/">Our trip to Vancouver and Japan</a></li>
    </ul>
  `
}

export const GET = async () => {
  const posts = await readMarkdownFiles('data/posts/*.md')
  return htmlToResponse(
    Layout({
      title: 'Home',
      children: buildChildren(),
    })
  )
}
