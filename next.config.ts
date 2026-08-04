import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  serverExternalPackages: ['pyodide'],
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // `node:child_process` is not covered by resolve.fallback alone
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, '')
        })
      )

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        child_process: false,
        module: false,
        worker_threads: false,
        url: false,
        vm: false,
        os: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig
