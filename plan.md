# Plan: Gallery Build Script

## Overview

Create `scripts/build-gallery.ts` that generates gallery routes from `data/` directory structure.

## Input Structure

The script reads from `data/` directory, looking for `about.md` files in each subdirectory.

### about.md Format

```markdown
# Title: Page Title Here

Introductory paragraph text.

## image-filename.jpeg

Description paragraph(s) for this image.
More paragraphs until next ## or ###.

### subdirectory-name

Description of what's in that subdirectory.
```

## Output Structure

For each `data/{path}/about.md`, the script generates:

1. **Route file**: `routes/gallery/{path}/({leaf}).server.ts`
2. **Images directory**: `routes/gallery/{path}/images/` containing copied jpeg files

### Generated Route Content

```typescript
import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '{relative-path}/components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: '{extracted-title}',
      children: html`
        <div class="text-xl">{title}</div>
        <p>{intro-paragraph}</p>

        <!-- For each ## image -->
        <div class="card">
          <figure>
            <img
              src="/gallery/{path}/images/{image-filename}"
              alt="{description}"
            />
          </figure>
          <div class="card-body">
            <p>{description-paragraphs}</p>
          </div>
        </div>

        <!-- For each ### subdirectory -->
        <a href="/gallery/{path}/{subdir}">{description}</a>
      `,
    })
  )
```

## Script Behavior

1. **Clean**: Delete everything under `routes/gallery/`
2. **Scan**: Recursively find all `about.md` files under `data/`
3. **Parse**: For each `about.md`:
   - Extract title (text after "# Title: ")
   - Extract intro paragraph (first paragraph after title)
   - Extract images (`## filename.jpeg` + following paragraphs)
   - Extract subdirectory links (`### dirname` + following paragraph)
4. **Generate**: Create route file with proper relative imports
5. **Copy**: Copy jpeg files to `images/` subdirectory

## File Naming

- `data/vancouver/about.md` → `routes/gallery/vancouver/(vancouver).server.ts`
- `data/vancouver/trees/about.md` → `routes/gallery/vancouver/trees/(trees).server.ts`

## Image Handling

- Source: `data/vancouver/IDG_123.jpeg`
- Destination: `routes/gallery/vancouver/images/IDG_123.jpeg`
- URL: `/gallery/vancouver/images/IDG_123.jpeg`
