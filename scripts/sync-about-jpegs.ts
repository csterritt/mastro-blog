#!/usr/bin/env bun

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(import.meta.dir, '..', 'data')

interface AboutScanResult {
  readonly mentionedJpegs: Set<string>
  readonly content: string
}

const normalizeJpegName = (name: string): string => name.toLowerCase()

const extractMentionedJpegs = (content: string): AboutScanResult => {
  const mentionedJpegs = new Set<string>()
  const lines = content.split('\n')
  for (const line of lines) {
    const thumbMatch = line.match(/^\s*-\s*thumb:\s*(\S+\.jpeg)\s*$/i)
    if (thumbMatch?.[1]) {
      mentionedJpegs.add(normalizeJpegName(thumbMatch[1]))
      continue
    }
    const headingMatch = line.match(/^##\s+(\S+\.jpeg)\s*$/i)
    if (headingMatch?.[1]) {
      mentionedJpegs.add(normalizeJpegName(headingMatch[1]))
    }
  }
  return { mentionedJpegs, content }
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
      continue
    }
    if (entry.isFile() && entry.name === 'about.md') {
      results.push(fullPath)
    }
  }
  return results
}

const listJpegFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.jpeg')
    )
    .map((entry) => entry.name)
}

const appendMissingJpegs = (
  content: string,
  missingJpegs: string[]
): string => {
  if (missingJpegs.length === 0) {
    return content
  }
  const trimmedContent = content.replace(/\s*$/, '')
  const additions = missingJpegs.map((name) => `\n\n## ${name}\n`).join('')
  return `${trimmedContent}${additions}\n`
}

const updateAboutFile = async (aboutPath: string): Promise<boolean> => {
  const dirPath = aboutPath.slice(0, -'/about.md'.length)
  const content = await readFile(aboutPath, 'utf-8')
  const { mentionedJpegs } = extractMentionedJpegs(content)
  const jpegFiles = await listJpegFiles(dirPath)
  const missingJpegs = jpegFiles.filter(
    (filename) => !mentionedJpegs.has(normalizeJpegName(filename))
  )
  if (missingJpegs.length === 0) {
    return false
  }
  const updatedContent = appendMissingJpegs(content, missingJpegs)
  await writeFile(aboutPath, updatedContent)
  return true
}

const main = async (): Promise<void> => {
  const aboutFiles = await findAboutFiles(DATA_DIR)
  let updatedCount = 0
  for (const aboutFile of aboutFiles) {
    const didUpdate = await updateAboutFile(aboutFile)
    if (didUpdate) {
      updatedCount += 1
      console.log(`Updated ${aboutFile}`)
    }
  }
  console.log(`Done. Updated ${updatedCount} about.md file(s).`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
