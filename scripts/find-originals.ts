#!/usr/bin/env bun

import { readdirSync, statSync, existsSync } from 'fs'
import { join, basename } from 'path'

const findJpegFiles = (dir: string, baseDir: string): string[] => {
  const results: string[] = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...findJpegFiles(fullPath, baseDir))
    } else if (entry.toLowerCase().endsWith('.jpeg')) {
      results.push(fullPath)
    }
  }

  return results
}

const dataDir = join(import.meta.dir, '..', 'data')
const tmpOriginalsDir = join(import.meta.dir, '..', 'tmp', 'originals')

if (!existsSync(dataDir)) {
  console.error(`Error: data directory not found: ${dataDir}`)
  process.exit(1)
}

if (!existsSync(tmpOriginalsDir)) {
  console.error(`Error: tmp/originals directory not found: ${tmpOriginalsDir}`)
  process.exit(1)
}

const jpegFiles = findJpegFiles(dataDir, dataDir)

for (const jpegPath of jpegFiles) {
  const filename = basename(jpegPath)
  const originalPath = join(tmpOriginalsDir, filename)

  if (existsSync(originalPath)) {
    console.log(`cp "${originalPath}" "${jpegPath}"`)
  }
}
