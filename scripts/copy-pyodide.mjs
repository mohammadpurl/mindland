/**
 * Copies Pyodide WASM/runtime files from node_modules into public/pyodide
 * so the browser can load them via indexURL `/pyodide/`.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'node_modules', 'pyodide')
const dest = path.join(root, 'public', 'pyodide')

const files = [
  'pyodide.asm.wasm',
  'pyodide.asm.mjs',
  'python_stdlib.zip',
  'pyodide.mjs',
  'pyodide.js',
  'pyodide-lock.json',
  'package.json',
]

if (!fs.existsSync(src)) {
  console.error('[copy-pyodide] node_modules/pyodide not found')
  process.exit(1)
}

fs.mkdirSync(dest, { recursive: true })
let missing = 0
for (const file of files) {
  const from = path.join(src, file)
  if (!fs.existsSync(from)) {
    console.warn(`[copy-pyodide] missing ${file}`)
    missing += 1
    continue
  }
  fs.copyFileSync(from, path.join(dest, file))
}

const required = ['pyodide.mjs', 'pyodide.asm.wasm', 'pyodide.asm.mjs', 'python_stdlib.zip']
for (const file of required) {
  if (!fs.existsSync(path.join(dest, file))) {
    console.error(`[copy-pyodide] required file missing after copy: ${file}`)
    process.exit(1)
  }
}

console.log(`[copy-pyodide] synced → public/pyodide (${files.length - missing} files)`)
