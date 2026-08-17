'use client'

import { useCallback, useRef, useState } from 'react'
import { loadPyodideSingleton, type PyodideLoadState } from '@/lib/pyodideLoader'

export type UsePyodideStatus = PyodideLoadState | 'running'

export interface RunPythonResult {
  output: string
  error: string | null
  hasError: boolean
  /** خطوط چاپ‌شده (برای نمایش چندخطی مینی) */
  outputLines?: string[]
  /** شماره خط ۱-based وقتی اجرا ترتیبی متوقف شود */
  errorLine?: number | null
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
  /**
   * اجرای خط‌به‌خط در یک namespace مشترک — خروجی قبل از خطا حفظ می‌شود
   * (برای دمو/تمرین PY-02 که SyntaxError کل فایل را یک‌جا نمی‌بندد).
   */
  runCodeSequential: (code: string) => Promise<RunPythonResult>
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
          const flat = lines.flatMap((t) => t.split('\n').filter((p) => p.length))
          return {
            output: flat.join('\n'),
            outputLines: flat,
            error: null,
            hasError: false,
            errorLine: null,
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          const flat = lines.flatMap((t) => t.split('\n').filter((p) => p.length))
          setStdoutLines(flat)
          setLastRawError(message)
          setStatusBoth('ready')
          return {
            output: flat.join('\n'),
            outputLines: flat,
            error: message,
            hasError: true,
            errorLine: null,
          }
        }
      } finally {
        runningLock.current = false
      }
    },
    [setStatusBoth]
  )

  const runCodeSequential = useCallback(
    async (code: string): Promise<RunPythonResult> => {
      if (runningLock.current) {
        return {
          output: '',
          error: 'ربات الان داره یه کار دیگه انجام می‌ده. کمی صبر کن.',
          hasError: true,
          outputLines: [],
          errorLine: null,
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
            return {
              output: '',
              error: message,
              hasError: true,
              outputLines: [],
              errorLine: null,
            }
          }
        }

        setStatusBoth('running')
        const py = await loadPyodideSingleton()
        // namespace تازه برای هر اجرا تا متغیرها بین دکمه‌های دمو قاطی نشوند
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globals = (py as any).runPython('dict()')

        const physicalLines = code.replace(/\r\n/g, '\n').split('\n')
        const collected: string[] = []

        for (let i = 0; i < physicalLines.length; i++) {
          const rawLine = physicalLines[i] ?? ''
          const trimmed = rawLine.trim()
          if (!trimmed || trimmed.startsWith('#')) continue

          const chunk: string[] = []
          py.setStdout({
            batched: (text: string) => {
              chunk.push(text)
            },
          })
          py.setStderr({
            batched: (text: string) => {
              chunk.push(text)
            },
          })

          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (py as any).runPythonAsync(trimmed, { globals })
            for (const t of chunk) {
              for (const part of t.split('\n')) {
                if (part.length) collected.push(part)
              }
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            setStdoutLines(collected)
            setLastRawError(message)
            setStatusBoth('ready')
            try {
              globals.destroy?.()
            } catch {
              /* ignore */
            }
            return {
              output: collected.join('\n'),
              outputLines: collected,
              error: message,
              hasError: true,
              errorLine: i + 1,
            }
          }
        }

        setStdoutLines(collected)
        setStatusBoth('ready')
        try {
          globals.destroy?.()
        } catch {
          /* ignore */
        }
        return {
          output: collected.join('\n'),
          outputLines: collected,
          error: null,
          hasError: false,
          errorLine: null,
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
    runCodeSequential,
    clearOutput,
  }
}
