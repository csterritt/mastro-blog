import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '../../components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: 'About',
      children: html`
        <div class="max-w-2xl mx-auto my-8">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h1 class="card-title text-3xl mb-4">About</h1>
              <p class="text-lg">All about us. Me. Whatever.</p>
              <div class="card-actions justify-end mt-6">
                <a href="/" class="btn btn-primary">Back Home</a>
              </div>
            </div>
          </div>
        </div>
      `,
    })
  )
