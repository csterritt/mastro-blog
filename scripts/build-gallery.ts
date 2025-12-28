import { readdir, readFile, rm, mkdir, copyFile, writeFile } from 'fs/promises'
import { join, relative } from 'path'

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

  return { title, introParagraph, images, subdirs }
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const generateRouteContent = (
  parsed: ParsedAbout,
  galleryPath: string,
  relativeToComponents: string
): string => {
  const imageCards = parsed.images
    .map((img) => {
      const descriptionText = img.paragraphs.join(' ')
      return `
        <div class="card bg-base-100 shadow-xl">
          <figure>
            <img src="/gallery/${galleryPath}/images/${img.filename}" alt="${escapeHtml(descriptionText)}" />
          </figure>
          <div class="card-body">
            <p>${escapeHtml(descriptionText)}</p>
          </div>
        </div>`
    })
    .join('\n')

  const subdirLinks = parsed.subdirs
    .map((subdir) => {
      return `
        <a href="/gallery/${galleryPath}/${subdir.name}/" class="link link-primary">${escapeHtml(subdir.description)}</a>`
    })
    .join('\n')

  return `import { html, htmlToResponse } from '@mastrojs/mastro'
import { Layout } from '${relativeToComponents}/components/Layout.js'

export const GET = () =>
  htmlToResponse(
    Layout({
      title: '${escapeHtml(parsed.title)}',
      children: html\`
        <div class="text-xl">${escapeHtml(parsed.title)}</div>
        <p>${escapeHtml(parsed.introParagraph)}</p>
${imageCards}
${subdirLinks}
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

const main = async () => {
  console.log('Cleaning gallery directory...')
  await rm(GALLERY_DIR, { recursive: true, force: true })
  await mkdir(GALLERY_DIR, { recursive: true })

  console.log('Finding about.md files...')
  const aboutFiles = await findAboutFiles(DATA_DIR)
  console.log(`Found ${aboutFiles.length} about.md files`)

  for (const aboutFile of aboutFiles) {
    const dataSubdir = aboutFile.slice(DATA_DIR.length + 1, -'/about.md'.length)
    const leafName = dataSubdir.split('/').pop() || dataSubdir
    console.log(`Processing: ${dataSubdir}`)

    const content = await readFile(aboutFile, 'utf-8')
    const parsed = parseAboutMd(content)

    const gallerySubdir = join(GALLERY_DIR, dataSubdir)
    await mkdir(gallerySubdir, { recursive: true })

    const depth = dataSubdir.split('/').length + 1
    const relativeToComponents = '../'.repeat(depth) + '..'

    const routeContent = generateRouteContent(
      parsed,
      dataSubdir,
      relativeToComponents
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
  }

  console.log('Done!')
}

main().catch(console.error)
