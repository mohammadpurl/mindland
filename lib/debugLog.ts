/**
 * Dev-only logger — never dumps env/state in production builds.
 */
export const isDev = process.env.NODE_ENV === 'development'

export function debugLog(...args: unknown[]): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}
