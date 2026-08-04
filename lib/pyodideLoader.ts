/**
 * Lazy-load + singleton Pyodide for the browser.
 *
 * Never `import('pyodide')` from node_modules in client code (Node builtins break Webpack).
 * Prefer `/public/pyodide` (filled by `postinstall` / `prebuild`), with jsDelivr CDN fallback.
 */

import type { PyodideInterface } from 'pyodide'

/** Must match installed `pyodide` package version (see package.json). */
export const PYODIDE_PACKAGE_VERSION = '314.0.3'

/** Same-origin path after `node scripts/copy-pyodide.mjs`. */
export const PYODIDE_INDEX_URL = '/pyodide/'

/** CDN fallback when public/pyodide was not deployed. */
export const PYODIDE_CDN_INDEX_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_PACKAGE_VERSION}/`

export type PyodideLoadState = 'idle' | 'loading' | 'ready' | 'error'

let instance: PyodideInterface | null = null
let loadPromise: Promise<PyodideInterface> | null = null
let lastError: Error | null = null

export function getPyodideSync(): PyodideInterface | null {
  return instance
}

export function getPyodideLoadError(): Error | null {
  return lastError
}

export function isPyodideReady(): boolean {
  return instance !== null
}

function toAbsoluteIndex(indexURL: string): string {
  if (indexURL.startsWith('http')) return indexURL.endsWith('/') ? indexURL : `${indexURL}/`
  if (typeof window === 'undefined') return indexURL
  return new URL(indexURL, window.location.origin).href
}

async function importFromIndex(indexURL: string): Promise<{
  loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
  indexURL: string
}> {
  const base = toAbsoluteIndex(indexURL)
  const moduleUrl = `${base}pyodide.mjs`
  const mod: unknown = await import(
    /* webpackIgnore: true */
    moduleUrl
  )
  return {
    ...(mod as {
      loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
    }),
    indexURL: base,
  }
}

async function importBrowserPyodide(): Promise<{
  loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
  indexURL: string
}> {
  const candidates = [PYODIDE_INDEX_URL, PYODIDE_CDN_INDEX_URL]
  const errors: string[] = []

  for (const index of candidates) {
    try {
      return await importFromIndex(index)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(`${index}: ${message}`)
    }
  }

  throw new Error(
    `لود Pyodide ناموفق بود. مطمئن شو prebuild فایل‌ها را به public/pyodide کپی کرده، یا CDN در دسترس است.\n${errors.join('\n')}`
  )
}

/**
 * Loads Pyodide once. Concurrent callers share the same promise.
 * Safe to call only in the browser (client components / effects).
 */
export async function loadPyodideSingleton(): Promise<PyodideInterface> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide فقط در مرورگر قابل بارگذاری است.')
  }

  if (instance) return instance
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    try {
      const { loadPyodide, indexURL } = await importBrowserPyodide()
      const pyodide = await loadPyodide({ indexURL })
      instance = pyodide
      lastError = null
      return pyodide
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      loadPromise = null
      throw lastError
    }
  })()

  return loadPromise
}

/** Test helper — not for production UI. */
export async function runPythonPrintSmoke(
  code = 'print("سلام از پایتون!")'
): Promise<{ output: string; error: string | null }> {
  const py = await loadPyodideSingleton()
  const lines: string[] = []

  py.setStdout({
    batched: (text: string) => {
      lines.push(text)
    },
  })
  py.setStderr({
    batched: (text: string) => {
      lines.push(text)
    },
  })

  try {
    await py.runPythonAsync(code)
    return { output: lines.join('\n'), error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { output: lines.join('\n'), error: message }
  }
}
