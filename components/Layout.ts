import { type Html, html } from '@mastrojs/mastro'
import { Header } from '../components/Header.js'
import { Footer } from '../components/Footer.js'

export interface Props {
  children: Html
  title: string
}

export const Layout = (props: Props) => html`
  <!DOCTYPE html>
  <html lang="en" class="h-full bg-base-200">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${props.title}</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body class="min-h-full flex flex-col">
      ${Header()}
      <main class="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        ${props.children}
      </main>
      ${Footer()}
    </body>
  </html>
`
