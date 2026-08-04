'use client'

import { useCallback, useRef, useState } from 'react'
import { loadPyodideSingleton, type PyodideLoadState } from '@/lib/pyodideLoader'

export type UsePyodideStatus = PyodideLoadState | 'running'

export interface RunPythonResult {
  output: string
  error: string | null
  hasError: boolean
}

export interface UsePyodideReturn {
  status: UsePyodideStatus
  ready: boolean
  loading: boolean
  running: boolean
  isBusy: boolean
  loadError: string | null
  stdoutLines: string[]
  lastRawError: string | null
  ensureLoaded: () => Promise<void>
  /** alias برای ensureLoaded */
  ensureReady: () => Promise<void>
  runCode: (code: string) => Promise<RunPythonResult>
  clearOutput: () => void
}

/**
 * هوک مدیریت وضعیت لود/اجرای Pyodide (مرحله ۱ — بدون ادیتور).
 */
export function usePyodide(): UsePyodideReturn {
  const [status, setStatus] = useState<UsePyodideStatus>('idle')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [stdoutLines, setStdoutLines] = useState<string[]>([])
  const [lastRawError, setLastRawError] = useState<string | null>(null)
  const runningLock = useRef(false)
  const statusRef = useRef<UsePyodideStatus>('idle')

  const setStatusBoth = useCallback((next: UsePyodideStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const ensureLoaded = useCallback(async () => {
    if (statusRef.current === 'ready' || statusRef.current === 'running') return
    setStatusBoth('loading')
    setLoadError(null)
    try {
      await loadPyodideSingleton()
      setStatusBoth('ready')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setLoadError(message)
      setStatusBoth('error')
      throw err
    }
  }, [setStatusBoth])

  const runCode = useCallback(
    async (code: string): Promise<RunPythonResult> => {
      if (runningLock.current) {
        return {
          output: '',
          error: 'ربات الان داره یه کار دیگه انجام می‌ده. کمی صبر کن.',
          hasError: true,
        }
      }

      runningLock.current = true
      setLastRawError(null)

      try {
        if (statusRef.current !== 'ready' && statusRef.current !== 'running') {
          setStatusBoth('loading')
          setLoadError(null)
          try {
            await loadPyodideSingleton()
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            setLoadError(message)
            setStatusBoth('error')
            return { output: '', error: message, hasError: true }
          }
        }

        setStatusBoth('running')
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
          setStdoutLines(lines)
          setStatusBoth('ready')
          return {
            output: lines.join('\n'),
            error: null,
            hasError: false,
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          setStdoutLines(lines)
          setLastRawError(message)
          setStatusBoth('ready')
          return {
            output: lines.join('\n'),
            error: message,
            hasError: true,
          }
        }
      } finally {
        runningLock.current = false
      }
    },
    [setStatusBoth]
  )

  const clearOutput = useCallback(() => {
    setStdoutLines([])
    setLastRawError(null)
  }, [])

  const loading = status === 'loading'
  const running = status === 'running'

  return {
    status,
    ready: status === 'ready' || status === 'running',
    loading,
    running,
    isBusy: loading || running,
    loadError,
    stdoutLines,
    lastRawError,
    ensureLoaded,
    ensureReady: ensureLoaded,
    runCode,
    clearOutput,
  }
}
