'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, SkipForward } from 'lucide-react'
import { ChatProvider } from '@/hooks/useChat'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { TeacherScene } from '@/app/components/TeacherScene'
import { LessonTeacherBubble } from '@/app/components/ui/lessons/LessonTeacherBubble'
import { useAvatarLessonSpeak } from '@/hooks/useAvatarLessonSpeak'
import {
  getPython00BlocksLesson,
  type BlockLessonStepId,
} from '@/lib/curriculum/lessons/python-00-blocks'
import { BlockStoryStage, type StageMode } from '@/app/components/lesson/BlockStoryStage'

function avatarLinesOf(step: {
  dialogueLines?: { speaker: string; text: string }[]
  narrator?: string
}): string[] {
  const fromDialogue =
    step.dialogueLines
      ?.filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')
      .map((l) => l.text)
      .filter((t) => t.trim().length > 0) ?? []
  if (fromDialogue.length > 0) return fromDialogue
  if (step.narrator?.trim()) return [step.narrator]
  return []
}

function stageModeOf(id: BlockLessonStepId): StageMode | null {
  if (id === 'demo') return 'demo'
  if (id === 'guided-practice') return 'guided'
  if (id === 'challenge-a') return 'challenge-a'
  if (id === 'challenge-b') return 'challenge-b'
  return null
}

function Python00BlocksClassroom({ lang }: { lang: string }) {
  const lesson = getPython00BlocksLesson()
  const { speak } = useAvatarLessonSpeak()
  const [stepId, setStepId] = useState<BlockLessonStepId>('intro')
  const [bandFocus, setBandFocus] = useState<'A' | 'B'>('A')
  const [skipped, setSkipped] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const [bubble, setBubble] = useState('')
  const [speaking, setSpeaking] = useState(false)

  const visibleSteps = useMemo(() => {
    return lesson.steps.filter((s) => s.band === 'both' || s.band === bandFocus)
  }, [lesson.steps, bandFocus])

  const step = visibleSteps.find((s) => s.id === stepId) ?? visibleSteps[0]!
  const stepIndex = visibleSteps.findIndex((s) => s.id === stepId)
  const lines = useMemo(() => avatarLinesOf(step), [step])
  const stageMode = stageModeOf(stepId)
  const isWrapAsMini = stepId === 'wrap-up'

  const speakLine = useCallback(
    (text: string) => {
      setBubble(text)
      setSpeaking(true)
      speak(text, { animation: 'Talking', emotion: 'explaining' })
      window.setTimeout(() => setSpeaking(false), Math.min(8000, 1200 + text.length * 45))
    },
    [speak]
  )

  useEffect(() => {
    setLineIndex(0)
    if (lines[0]) speakLine(lines[0])
    else setBubble('')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- فقط با عوض شدن مرحله
  }, [stepId, bandFocus])

  function go(delta: number) {
    const ids = visibleSteps.map((s) => s.id)
    const i = ids.indexOf(stepId)
    const next = ids[i + delta]
    if (next) setStepId(next)
  }

  function nextLine() {
    if (lineIndex + 1 < lines.length) {
      const next = lineIndex + 1
      setLineIndex(next)
      speakLine(lines[next]!)
      return
    }
    go(1)
  }

  if (skipped) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center" dir="rtl">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600" aria-hidden />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">این ایستگاه را رد کردی</h1>
        <p className="mt-2 text-slate-600">اگر قبلاً با بلوک کار کرده‌ای، می‌توانی سراغ درس بعدی بروی.</p>
        <Link
          href={`/${lang}/curriculum/programming/python`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-extrabold text-white"
        >
          فهرست پایتون کودکان
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="lesson-classroom" dir="rtl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-xs font-bold text-white/70">
            {lesson.code} · اختیاری · {lesson.duration} · نسخه ۲
          </p>
          <h1 className="text-lg font-extrabold text-white md:text-xl">{lesson.title}</h1>
          <p className="text-xs font-bold text-teal-200/90">{lesson.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBandFocus('A')}
            className={[
              'rounded-lg px-2.5 py-1 text-[11px] font-extrabold',
              bandFocus === 'A' ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/80',
            ].join(' ')}
          >
            رده A
          </button>
          <button
            type="button"
            onClick={() => setBandFocus('B')}
            className={[
              'rounded-lg px-2.5 py-1 text-[11px] font-extrabold',
              bandFocus === 'B' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80',
            ].join(' ')}
          >
            رده B
          </button>
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/80"
          >
            <SkipForward className="h-3 w-3" aria-hidden />
            رد کردن
          </button>
        </div>
      </div>

      <div className="lesson-classroom__grid">
        <aside className="lesson-classroom__avatar-col">
          {isWrapAsMini ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
              <Image
                src="/charackter/char.png"
                alt="مینی"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
              <p className="text-xs font-bold text-teal-200">از زبان مینی</p>
            </div>
          ) : (
            <TeacherScene
              height="min(38vh, 320px)"
              className="lesson-classroom__avatar w-full border border-white/15"
              withChatProvider={false}
              withBridge={false}
            />
          )}
          <LessonTeacherBubble message={bubble || '…'} speaking={speaking} />
          {lines.length > 1 ? (
            <p className="mt-2 text-center text-[10px] font-bold text-white/50">
              گفته {lineIndex + 1} از {lines.length}
            </p>
          ) : null}
        </aside>

        <section className="lesson-classroom__stage min-h-0" aria-label={step.title}>
          <div className="lesson-classroom__stage-inner !items-stretch !p-3 md:!p-4">
            <h2 className="mb-3 text-center text-base font-extrabold text-white md:text-lg">
              {step.title}
            </h2>

            {step.brief && (step.id === 'challenge-a' || step.id === 'challenge-b') ? (
              <p className="mb-4 rounded-xl border border-orange-300/40 bg-orange-500/20 px-4 py-3 text-center text-sm font-extrabold leading-7 text-white">
                {step.brief}
              </p>
            ) : null}

            {stageMode ? (
              <BlockStoryStage
                key={stepId}
                mode={stageMode}
                mission={
                  step.id === 'guided-practice' || stageMode === 'demo'
                    ? step.stageMission
                    : step.brief || step.stageMission
                }
                checklist={step.missionChecklist}
                onNarrate={speakLine}
              />
            ) : null}

            <div className="mt-4 flex items-center justify-between gap-3 px-1">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={stepIndex <= 0}
                className="lesson-btn-secondary text-sm disabled:opacity-40"
              >
                قبلی
              </button>
              <span className="flex-1 text-center text-xs text-white/70">
                گام {stepIndex + 1} از {visibleSteps.length}
              </span>
              <button
                type="button"
                onClick={nextLine}
                className="lesson-btn-primary !px-4 !py-2 text-sm"
              >
                {lineIndex + 1 < lines.length
                  ? 'ادامهٔ گفته'
                  : stepId === 'wrap-up'
                    ? 'پایان'
                    : 'بعدی'}
              </button>
            </div>

            {stepId === 'wrap-up' && lineIndex + 1 >= lines.length ? (
              <div className="mt-4 flex justify-center">
                <Link
                  href={`/${lang}/curriculum/programming/python`}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-extrabold text-white"
                >
                  بازگشت به فهرست
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="lesson-classroom__progress mt-3">
        <div
          className="lesson-classroom__progress-fill"
          style={{ width: `${((stepIndex + 1) / visibleSteps.length) * 100}%` }}
        />
      </div>
      <p className="lesson-classroom__progress-label">
        {lesson.title} — {step.title}
      </p>
    </div>
  )
}

/**
 * درس PY-00 نسخه ۲ — مأموریت‌محور.
 */
export function Python00BlocksLessonView({ lang }: { lang: string }) {
  return (
    <ChatProvider>
      <LessonAvatarBridge />
      <div className="lesson-classroom-shell px-3 py-4 md:px-6 md:py-6">
        <nav className="mb-3 text-sm text-white/60" aria-label="مسیر" dir="rtl">
          <Link href={`/${lang}/curriculum`} className="hover:text-white">
            مدارس
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <Link href={`/${lang}/curriculum/programming`} className="hover:text-white">
            برنامه‌نویسی
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-white/90">PY-00</span>
        </nav>
        <Python00BlocksClassroom lang={lang} />
      </div>
    </ChatProvider>
  )
}
