import { readdir, readFile, rm, mkdir, copyFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface ImageEntry {
  filename: string
  paragraphs: string[]
}

interface SubdirEntry {
  name: string
  description: string
}

interface ParsedAbout {
  title: string
  introParagraph: string
  thumbnail?: string
  images: ImageEntry[]
  subdirs: SubdirEntry[]
}

const DATA_DIR = join(import.meta.dir, '..', 'data')
const ROUTES_DIR = join(import.meta.dir, '..', 'routes')
const GALLERY_DIR = join(ROUTES_DIR, 'gallery')

const parseAboutMd = (content: string): ParsedAbout => {
  const lines = content.split('\n')
  let title = ''
  let introParagraph = ''
  let thumbnail: string | undefined
  const images: ImageEntry[] = []
  const subdirs: SubdirEntry[] = []

  let currentImage: ImageEntry | null = null
  let currentSubdir: SubdirEntry | null = null
  let collectingIntro = false
  let introParagraphLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] as string

    if (line.startsWith('# Title: ')) {
      title = line.slice('# Title: '.length).trim()
      collectingIntro = true
      continue
    }

    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('- thumb:')) {
      thumbnail = trimmedLine.slice('- thumb:'.length).trim()
      continue
    }

    if (line.startsWith('## ')) {
      if (currentImage) {
        images.push(currentImage)
      }

      if (currentSubdir) {
        subdirs.push(currentSubdir)
        currentSubdir = null
      }

      collectingIntro = false
      currentImage = {
        filename: line.slice(3).trim(),
        paragraphs: [],
      }
      continue
    }

    if (line.startsWith('### ')) {
      if (currentImage) {
        images.push(currentImage)
        currentImage = null
      }

      if (currentSubdir) {
        subdirs.push(currentSubdir)
      }

      collectingIntro = false
      currentSubdir = {
        name: line.slice(4).trim(),
        description: '',
      }
      continue
    }

    if (collectingIntro) {
      if (line.trim() === '') {
        if (introParagraphLines.length > 0) {
          introParagraph = introParagraphLines.join(' ')
          collectingIntro = false
        }
      } else {
        introParagraphLines.push(line.trim())
      }

      continue
    }

    if (currentImage && line.trim() !== '') {
      currentImage.paragraphs.push(line.trim())
    }

    if (
      currentSubdir &&
      line.trim() !== '' &&
      currentSubdir.description === ''
    ) {
      currentSubdir.description = line.trim()
    }
  }

  if (introParagraphLines.length > 0 && introParagraph === '') {
    introParagraph = introParagraphLines.join(' ')
  }

  if (currentImage) {
    images.push(currentImage)
  }

  if (currentSubdir) {
    subdirs.push(currentSubdir)
  }

  return { title, introParagraph, thumbnail, images, subdirs }
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const generateImageDetailPage = (
  imageName: string,
  description: string,
  galleryPath: string,
  relativeToComponents: string,
  galleryTitle: string,
  prevImageSlug: string,
  nextImageSlug: string
): string => {
  return `import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '${relativeToComponents}/components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: '${escapeHtml(galleryTitle)}',
      children: html\`
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-row justify-between items-center mb-4">
            <p class="mr-2">${escapeHtml(description)}</p>
            <a href="/gallery/${galleryPath}/" class="btn btn-primary">
              Back to ${escapeHtml(galleryTitle)}
            </a>
          </div>
          <div class="relative group">
            <img src="/gallery/${galleryPath}/images/${imageName}" alt="${escapeHtml(description)}" class="w-full" />

            <a href="/gallery/${galleryPath}/big/${prevImageSlug}/" class="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm md:btn-md btn-ghost bg-base-100/30 hover:bg-base-100/80 text-base-content border-none backdrop-blur-sm transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 md:w-6 md:h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </a>

            <a href="/gallery/${galleryPath}/big/${nextImageSlug}/" class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm md:btn-md btn-ghost bg-base-100/30 hover:bg-base-100/80 text-base-content border-none backdrop-blur-sm transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 md:w-6 md:h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      \`,
    })
  )
`
}

const generateRouteContent = (
  parsed: ParsedAbout,
  galleryPath: string,
  relativeToComponents: string,
  parentPath: string | null,
  parentTitle: string | null,
  metadataMap: Map<string, { title: string; thumbnail?: string }>
): string => {
  const imageCards = parsed.images
    .map((img) => {
      const descriptionText = img.paragraphs.join(' ')
      const imageNameWithoutExt = img.filename.replace(/\.jpeg$/i, '')
      return `
        <a href="/gallery/${galleryPath}/big/${imageNameWithoutExt}/" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <figure class="aspect-square overflow-hidden">
            <img src="/gallery/${galleryPath}/images/${img.filename}" alt="${escapeHtml(descriptionText)}" class="w-full h-full object-cover" />
          </figure>
          <div class="card-body p-4">
            <p class="text-sm line-clamp-3">${escapeHtml(descriptionText)}</p>
          </div>
        </a>`
    })
    .join('\n')

  const subdirLinks = parsed.subdirs
    .map((subdir) => {
      const subdirPath = `${galleryPath}/${subdir.name}`
      const subdirMetadata = metadataMap.get(subdirPath)
      const subdirThumb = subdirMetadata?.thumbnail

      const thumbHtml = subdirThumb
        ? `<figure><img src="/gallery/${subdirPath}/images/${subdirThumb}" alt="${escapeHtml(subdir.description)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></figure>`
        : `<figure class="bg-neutral flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-neutral-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></figure>`

      return `
        <a href="/gallery/${subdirPath}/" class="card col-span-1 md:col-span-2 image-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-64 md:h-80 group overflow-hidden">
          ${thumbHtml}
          <div class="card-body justify-end">
            <h2 class="card-title text-2xl md:text-3xl text-white drop-shadow-md">
              ${escapeHtml(subdir.description)}
            </h2>
            <div class="card-actions justify-end">
               <span class="btn btn-primary btn-sm">Explore Collection</span>
            </div>
          </div>
        </a>`
    })
    .join('\n')

  const backLink =
    parentPath && parentTitle
      ? `
        <div class="mb-6">
          <a href="${parentPath}" class="btn btn-ghost gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to ${escapeHtml(parentTitle)}
          </a>
        </div>`
      : ''

  return `import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '${relativeToComponents}/components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: '${escapeHtml(parsed.title)}',
      children: html\`
        ${backLink}
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">${escapeHtml(parsed.title)}</h1>
          <p class="text-lg text-base-content/80 max-w-2xl">${escapeHtml(parsed.introParagraph)}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          ${imageCards}
        </div>

        ${
          subdirLinks
            ? `
        <div class="mb-2">
          <h2 class="text-xl font-bold mb-2">This album also includes collections for:</h2>
        </div>`
            : ''
        }

        ${subdirLinks ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">${subdirLinks}</div>` : ''}
      \`,
    })
  )
`
}

const findAboutFiles = async (dir: string): Promise<string[]> => {
  const results: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue
    }

    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      const subdirResults = await findAboutFiles(fullPath)
      results.push(...subdirResults)
    } else if (entry.name === 'about.md') {
      results.push(fullPath)
    }
  }

  return results
}

const findJpegFiles = async (dir: string): Promise<string[]> => {
  const results: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.jpeg')) {
      results.push(join(dir, entry.name))
    }
  }

  return results
}

const generateGalleryIndex = (
  galleryEntries: Array<{ path: string; title: string; thumbnail?: string }>
): string => {
  const cards = galleryEntries
    .map((entry) => {
      const thumbHtml = entry.thumbnail
        ? `<figure><img src="/gallery/${entry.path}/images/${entry.thumbnail}" alt="${escapeHtml(entry.title)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></figure>`
        : `<figure class="bg-neutral flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-neutral-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></figure>`

      return `
        <a href="/gallery/${entry.path}/" class="card col-span-1 md:col-span-2 image-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-64 md:h-80 group overflow-hidden">
          ${thumbHtml}
          <div class="card-body justify-end">
            <h2 class="card-title text-3xl text-white drop-shadow-md">${escapeHtml(entry.title)}</h2>
            <div class="card-actions justify-end">
               <button class="btn btn-primary">Browse Gallery</button>
            </div>
          </div>
        </a>`
    })
    .join('\n')

  return `import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '../../components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: 'Photo Gallery',
      children: html\`
        <div class="text-center py-8">
          <h1 class="text-4xl font-bold mb-4">Photo Gallery</h1>
          <p class="text-lg text-base-content/70">Browse the photo collections</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${cards}
        </div>
      \`,
    })
  )
`
}

const main = async () => {
  console.log('Cleaning gallery directory...')
  await rm(GALLERY_DIR, { recursive: true, force: true })
  await mkdir(GALLERY_DIR, { recursive: true })

  console.log('Finding about.md files...')
  const aboutFiles = await findAboutFiles(DATA_DIR)
  console.log(`Found ${aboutFiles.length} about.md files`)

  const galleryEntries: Array<{
    path: string
    title: string
    thumbnail?: string
  }> = []
  const metadataMap = new Map<string, { title: string; thumbnail?: string }>()

  for (const aboutFile of aboutFiles) {
    const dataSubdir = aboutFile.slice(DATA_DIR.length + 1, -'/about.md'.length)
    const content = await readFile(aboutFile, 'utf-8')
    const parsed = parseAboutMd(content)
    metadataMap.set(dataSubdir, {
      title: parsed.title,
      thumbnail: parsed.thumbnail,
    })

    if (!dataSubdir.includes('/')) {
      galleryEntries.push({
        path: dataSubdir,
        title: parsed.title,
        thumbnail: parsed.thumbnail,
      })
    }
  }

  for (const aboutFile of aboutFiles) {
    const dataSubdir = aboutFile.slice(DATA_DIR.length + 1, -'/about.md'.length)
    const leafName = dataSubdir.split('/').pop() || dataSubdir
    console.log(`Processing: ${dataSubdir}`)

    const content = await readFile(aboutFile, 'utf-8')
    const parsed = parseAboutMd(content)

    const pathParts = dataSubdir.split('/')
    let parentPath: string | null = null
    let parentTitle: string | null = null

    if (pathParts.length > 1) {
      const parentDataPath = pathParts.slice(0, -1).join('/')
      parentPath = `/gallery/${parentDataPath}/`
      parentTitle = metadataMap.get(parentDataPath)?.title || null
    } else {
      parentPath = '/gallery/'
      parentTitle = 'Photo Gallery'
    }

    const gallerySubdir = join(GALLERY_DIR, dataSubdir)
    await mkdir(gallerySubdir, { recursive: true })

    const depth = dataSubdir.split('/').length + 1
    const relativeToComponents = '../'.repeat(depth) + '..'

    const routeContent = generateRouteContent(
      parsed,
      dataSubdir,
      relativeToComponents,
      parentPath,
      parentTitle,
      metadataMap
    )
    const routeFile = join(gallerySubdir, `(${leafName}).server.ts`)
    await writeFile(routeFile, routeContent)
    console.log(`  Created: ${routeFile}`)

    const sourceDir = aboutFile.slice(0, -'/about.md'.length)
    const jpegFiles = await findJpegFiles(sourceDir)

    if (jpegFiles.length > 0) {
      const imagesDir = join(gallerySubdir, 'images')
      await mkdir(imagesDir, { recursive: true })

      for (const jpegFile of jpegFiles) {
        const filename = jpegFile.split('/').pop()!
        const destFile = join(imagesDir, filename)
        await copyFile(jpegFile, destFile)
        console.log(`  Copied: ${filename}`)
      }
    }

    const bigDir = join(gallerySubdir, 'big')
    await mkdir(bigDir, { recursive: true })

    for (let i = 0; i < parsed.images.length; i++) {
      const img = parsed.images[i]!
      const prevIndex = (i - 1 + parsed.images.length) % parsed.images.length
      const nextIndex = (i + 1) % parsed.images.length
      const prevImg = parsed.images[prevIndex]!
      const nextImg = parsed.images[nextIndex]!

      const prevImageSlug = prevImg.filename.replace(/\.jpeg$/i, '')
      const nextImageSlug = nextImg.filename.replace(/\.jpeg$/i, '')

      const descriptionText = img.paragraphs.join(' ')
      const imageNameWithoutExt = img.filename.replace(/\.jpeg$/i, '')
      const bigDepth = dataSubdir.split('/').length + 3
      const bigRelativeToComponents = '../'.repeat(bigDepth) + '..'

      const imageDetailDir = join(bigDir, imageNameWithoutExt)
      await mkdir(imageDetailDir, { recursive: true })

      const imageDetailContent = generateImageDetailPage(
        img.filename,
        descriptionText,
        dataSubdir,
        bigRelativeToComponents,
        parsed.title,
        prevImageSlug,
        nextImageSlug
      )
      const imageDetailFile = join(
        imageDetailDir,
        `(${imageNameWithoutExt}).server.ts`
      )
      await writeFile(imageDetailFile, imageDetailContent)
      console.log(`  Created image detail: ${imageDetailFile}`)
    }
  }

  console.log('Generating gallery index...')
  const indexContent = generateGalleryIndex(galleryEntries)
  const indexFile = join(GALLERY_DIR, '(gallery).server.ts')
  await writeFile(indexFile, indexContent)
  console.log(`  Created: ${indexFile}`)

  console.log('Done!')
}

main().catch(console.error)
