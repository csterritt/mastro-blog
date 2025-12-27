import { getParams, htmlToResponse, readDir } from '@mastrojs/mastro'
import { readMarkdownFile } from '@mastrojs/markdown'
import { Layout } from '../../components/Layout.js'

export const getStaticPaths = async () => {
  const posts = await readDir('data/posts/')
  return posts.map((p) => '/news/' + p.slice(0, -3))
}

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
