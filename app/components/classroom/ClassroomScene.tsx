import dynamic from 'next/dynamic'

const ClassroomSceneClient = dynamic(
  () => import('@/app/components/classroom/ClassroomScene.client'),
  { ssr: false }
)

interface Props {
  className?: string
  height?: string
  withChatProvider?: boolean
  withBridge?: boolean
}

export function ClassroomScene(props: Props) {
  return <ClassroomSceneClient {...props} />
}
