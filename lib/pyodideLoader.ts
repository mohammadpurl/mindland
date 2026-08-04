/**
 * Lazy-load + singleton Pyodide for the browser.
 * Artifacts are served from /public/pyodide (copied from node_modules on postinstall).
 *
 * IMPORTANT: never `import('pyodide')` from node_modules in client code —
 * that package pulls Node builtins (`node:child_process`) and breaks Webpack.
 * Load the browser build from `/pyodide/pyodide.mjs` instead.
 */

import type { PyodideInterface } from 'pyodide'

/** Must match installed `pyodide` package version (see package.json). */
export const PYODIDE_PACKAGE_VERSION = '314.0.3'

/** Where wasm / stdlib are served in Next (see scripts/copy-pyodide.mjs). */
export const PYODIDE_INDEX_URL = '/pyodide/'

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

async function importBrowserPyodide(): Promise<{
  loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
}> {
  // Dynamic URL + webpackIgnore keeps node_modules/pyodide out of the client bundle.
  const url = `${PYODIDE_INDEX_URL}pyodide.mjs`
  const mod: unknown = await import(
    /* webpackIgnore: true */
    url
  )
  return mod as {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>
  }
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
      const { loadPyodide } = await importBrowserPyodide()
      const pyodide = await loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
      })
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
