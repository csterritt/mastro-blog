import { html, htmlToResponse } from '@mastrojs/mastro'
import { readMarkdownFiles } from '@mastrojs/markdown'
import { Layout } from '../components/Layout.js'

const buildChildren = () => {
  return html`<p>Cool beans.</p>`
}

export const GET = async () => {
  const posts = await readMarkdownFiles('data/posts/*.md')
  return htmlToResponse(
    Layout({
      title: 'News',
      children: buildChildren(),
    })
  )
}
