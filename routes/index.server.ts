import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '../components/Layout.ts'
import { Header } from '../components/Header.js'
import { Footer } from '../components/Footer.js'

export const GET = (_req: Request) =>
  htmlToResponse(
    Layout({
      title: 'Hello World',
      children: html`
        ${Header()}
        <p>Welcome!</p>
        ${Footer()}
      `,
    })
  )
