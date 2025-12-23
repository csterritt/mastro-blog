import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '../../components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: 'About',
      children: html` <p>All about us. Me. Whatever.</p> `,
    })
  )
