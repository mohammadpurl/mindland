/**
 * رفع باگ GLTFLoader: تکسچرهای embed داخل .glb با blob URL + revoke زودهنگام خراب می‌شوند.
 * راه‌حل: decode مستقیم از bufferView با createImageBitmap — بدون blob URL.
 */

import { LoaderUtils, Texture } from 'three'
import type { GLTFLoader } from 'three-stdlib'

const PLUGIN_NAME = 'MINDLAND_BLOB_TEXTURE_FIX'

type GltfParserLike = {
  json: { images: Array<{ uri?: string; bufferView?: number; mimeType?: string }> }
  options: { path?: string }
  sourceCache: Record<number, Promise<unknown> | undefined>
  getDependency: (type: string, index: number) => Promise<ArrayBuffer>
  loadImageSource?: (sourceIndex: number, loader: TextureLoaderLike) => Promise<unknown>
  __mindlandBlobPatch?: boolean
}

type TextureLoaderLike = {
  load: (
    url: string,
    onLoad: (result: unknown) => void,
    onProgress?: unknown,
    onError?: (err: unknown) => void
  ) => void
  isImageBitmapLoader?: boolean
}

async function textureFromEmbeddedBuffer(
  bufferView: ArrayBuffer,
  mimeType: string
): Promise<Texture | null> {
  try {
    const blob = new Blob([bufferView], { type: mimeType || 'image/png' })

    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(blob)
      const texture = new Texture(bitmap)
      texture.needsUpdate = true
      return texture
    }

    return await new Promise<Texture>((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)
      img.onload = () => {
        const texture = new Texture(img)
        texture.needsUpdate = true
        resolve(texture)
      }
      img.onerror = reject
      img.src = url
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Avatar GLTF] embedded texture decode failed:', error)
    }
    return null
  }
}

function loadExternalImage(
  uri: string,
  path: string,
  texLoader: TextureLoaderLike
): Promise<Texture | null> {
  const resolved = LoaderUtils.resolveURL(uri, path)
  if (!resolved) return Promise.resolve(null)

  return new Promise<Texture | null>((resolve, reject) => {
    let onLoad: (result: unknown) => void = (result) => resolve(result as Texture)

    if (texLoader.isImageBitmapLoader === true) {
      onLoad = (imageBitmap: unknown) => {
        const texture = new Texture(imageBitmap as ImageBitmap)
        texture.needsUpdate = true
        resolve(texture)
      }
    }

    texLoader.load(resolved, onLoad, undefined, reject)
  }).catch(() => null)
}

export function extendAvatarGltfLoader(loader: GLTFLoader): void {
  const tagged = loader as GLTFLoader & { __mindlandLoaderExtended?: boolean }
  if (tagged.__mindlandLoaderExtended) return
  tagged.__mindlandLoaderExtended = true

  ;(loader.register as (cb: (parser: unknown) => { name: string }) => GLTFLoader)(
    (parser) => {
      const p = parser as unknown as GltfParserLike
      if (p.__mindlandBlobPatch) {
        return { name: PLUGIN_NAME }
      }
      p.__mindlandBlobPatch = true

      p.loadImageSource = function loadImageSourcePatched(
        sourceIndex: number,
        texLoader: TextureLoaderLike
      ) {
        const cache = this.sourceCache
        if (cache[sourceIndex] !== undefined) {
          return cache[sourceIndex]!.then((texture) => {
            if (texture && typeof texture === 'object' && 'clone' in texture) {
              return (texture as Texture).clone()
            }
            return texture
          })
        }

        const sourceDef = this.json.images[sourceIndex]
        if (!sourceDef) {
          return Promise.resolve(null)
        }

        const path = this.options.path || ''

        const promise: Promise<Texture | null> =
          sourceDef.bufferView !== undefined
            ? this.getDependency('bufferView', sourceDef.bufferView).then((bufferView) =>
                textureFromEmbeddedBuffer(bufferView, sourceDef.mimeType || 'image/png')
              )
            : loadExternalImage(sourceDef.uri || '', path, texLoader)

        const cached = promise.catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Avatar GLTF] texture load failed:', error)
          }
          return null
        })

        cache[sourceIndex] = cached
        return cached
      }

      return { name: PLUGIN_NAME }
    }
  )
}

export const avatarGltfLoaderExtension = extendAvatarGltfLoader
