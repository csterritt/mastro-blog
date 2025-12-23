import { type Html, html } from '@mastrojs/mastro'
import { Header } from '../components/Header.js'
import { Footer } from '../components/Footer.js'

export interface Props {
  children: Html
  title: string
}

export const Layout = (props: Props) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${props.title}</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      ${Header()} ${props.children} ${Footer()}
    </body>
  </html>
`
