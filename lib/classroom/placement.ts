import { MathUtils } from 'three'

const deg = MathUtils.degToRad

export const CLASSROOM_GLB = '/models/classroom_default.glb'

export const classroomPlacement = {
  classroom: {
    position: [0.2, -1.7, -2] as [number, number, number],
    scale: 1,
  },
  teacher: {
    position: [-1.05, -1.55, -2.8] as [number, number, number],
    rotation: [0, deg(18), 0] as [number, number, number],
    scale: 0.72,
  },
  board: {
    position: [0.42, 0.35, -5.8] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    distanceFactor: 1.15,
  },
}

export const CAMERA_SPEAKING = {
  position: [0, 0.05, 0.0001] as [number, number, number],
  zoom: 2.1,
}

export const CAMERA_DEFAULT = {
  position: [0, 0, 0.0001] as [number, number, number],
  zoom: 1,
}
