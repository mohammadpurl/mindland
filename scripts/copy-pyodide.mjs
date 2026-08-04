/**
 * Copies Pyodide WASM/runtime files from node_modules into public/pyodide
 * so the browser can load them via indexURL `/pyodide/`.
 */
const fs = require('fs')
const path = require('path')

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
  console.warn('[copy-pyodide] node_modules/pyodide not found — skip')
  process.exit(0)
}

fs.mkdirSync(dest, { recursive: true })
for (const file of files) {
  const from = path.join(src, file)
  if (!fs.existsSync(from)) {
    console.warn(`[copy-pyodide] missing ${file}`)
    continue
  }
  fs.copyFileSync(from, path.join(dest, file))
}
console.log('[copy-pyodide] synced → public/pyodide')
