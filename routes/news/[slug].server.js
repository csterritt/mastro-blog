import { getParams, htmlToResponse } from '@mastrojs/mastro'
import { readMarkdownFile } from '@mastrojs/markdown'
import { Layout } from '../../components/Layout.js'

export const GET = async (req) => {
  console.log(`req is`, req)
  const params = getParams(req)
  console.log(`params is`, params)
  const slug = params.slug
  console.log(`slug is ${JSON.stringify(slug)}`)
  const post = await readMarkdownFile(`data/posts/${slug}.md`)
  return htmlToResponse(
    Layout({
      title: post.meta.title,
      children: post.content,
    })
  )
}
