import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '../components/Layout.js'

const buildChildren = () => {
  return html`
    <div class="hero min-h-[50vh] bg-base-200 rounded-box mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome</h1>
          <p class="py-6">
            Explore our collection of stories and moments captured in time.
          </p>
          <a href="/gallery/" class="btn btn-primary">Browse Gallery</a>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Photo Gallery</h2>
          <p>Check out the latest additions to our photo collection.</p>
          <div class="card-actions justify-end">
            <a href="/gallery/" class="btn btn-secondary">View Photos</a>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">About</h2>
          <p>Learn more about this project and the technology behind it.</p>
          <div class="card-actions justify-end">
            <a href="/about/" class="btn btn-secondary">Read More</a>
          </div>
        </div>
      </div>
    </div>
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
