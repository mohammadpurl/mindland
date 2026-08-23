'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ChatProvider } from '@/hooks/useChat'
import { ClassroomBoardProvider, useClassroomBoard } from '@/hooks/useClassroomBoard'
import { ClassroomScene } from '@/app/components/classroom/ClassroomScene'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { LessonTeacherBubble } from '@/app/components/ui/lessons/LessonTeacherBubble'
import { useAvatarLessonSpeak } from '@/hooks/useAvatarLessonSpeak'
import {
  getPython01IntroLesson,
  type Py01DialogueLine,
  type Py01StepId,
} from '@/lib/curriculum/lessons/python-01-intro'
import { findPy01LineByText } from '@/lib/curriculum/lessons/python-01-system-messages'
import { PythonCodeRunner } from '@/app/components/lesson/PythonCodeRunner'
import { markLessonCompleted } from '@/lib/lessonProgress'

function dialogueLinesOf(step: {
  dialogueLines?: Py01DialogueLine[]
  narrator?: string
}): Py01DialogueLine[] {
  const fromDialogue =
    step.dialogueLines?.filter((l) => l.text.trim().length > 0) ?? []
  if (fromDialogue.length > 0) return fromDialogue
  if (step.narrator?.trim()) {
    return [{ speaker: 'avatar', text: step.narrator, animation: 'Talking' }]
  }
  return []
}

function resolveNarrateLine(
  text: string,
  lessonLines: Py01DialogueLine[]
): Py01DialogueLine {
  const trimmed = text.trim()
  const fromLesson = lessonLines.find((l) => l.text === trimmed)
  if (fromLesson) return fromLesson
  const fromSystem = findPy01LineByText(trimmed)
  if (fromSystem) return fromSystem
  return { speaker: 'avatar', text: trimmed, animation: 'Thinking' }
}

function Python01ClassroomInner({ lang }: { lang: string }) {
  const lesson = useMemo(() => getPython01IntroLesson(), [])
  const { setBoard } = useClassroomBoard()
  const { speakStepLine } = useAvatarLessonSpeak()
  const [stepId, setStepId] = useState<Py01StepId>('intro')
  const [bandFocus, setBandFocus] = useState<'A' | 'B'>('A')
  const [lineIndex, setLineIndex] = useState(0)
  const [bubble, setBubble] = useState('')
  const [speaking, setSpeaking] = useState(false)

  const visibleSteps = useMemo(
    () => lesson.steps.filter((s) => s.band === 'both' || s.band === bandFocus),
    [lesson.steps, bandFocus]
  )

  const step = visibleSteps.find((s) => s.id === stepId) ?? visibleSteps[0]!
  const stepIndex = visibleSteps.findIndex((s) => s.id === stepId)
  const lines = useMemo(() => dialogueLinesOf(step), [step])
  const allLessonLines = useMemo(
    () => lesson.steps.flatMap((s) => s.dialogueLines ?? []),
    [lesson.steps]
  )

  const showRunner =
    stepId === 'demo' ||
    stepId === 'guided-practice' ||
    stepId === 'challenge-a' ||
    stepId === 'challenge-b'
  const isWrapUp = stepId === 'wrap-up'
  const lessonFinished = isWrapUp && lineIndex + 1 >= lines.length

  useEffect(() => {
    if (lessonFinished) markLessonCompleted(lesson.id)
  }, [lessonFinished, lesson.id])

  const showLine = useCallback(
    (line: Py01DialogueLine) => {
      setBubble(line.text)
      setBoard({
        title: line.board?.title ?? step.title,
        lines: line.board?.lines ?? [line.text],
        code: line.board?.code,
        checklist: line.board?.checklist,
        speaking: false,
      })
    },
    [setBoard, step.title]
  )

  const speakDialogueLine = useCallback(
    (line: Py01DialogueLine, index: number) => {
      showLine(line)
      setSpeaking(true)
      speakStepLine(lesson.id, stepId, index, line.text, {
        animation: 'Talking',
        emotion: 'explaining',
      })
      window.setTimeout(() => setSpeaking(false), Math.min(8000, 1200 + line.text.length * 45))
    },
    [showLine, speakStepLine, lesson.id, stepId]
  )

  const narrateFromText = useCallback(
    (text: string) => {
      const line = resolveNarrateLine(text, allLessonLines)
      showLine(line)
      setSpeaking(true)
      speakStepLine(lesson.id, stepId, -1, line.text, {
        animation: 'Talking',
        emotion: 'explaining',
      })
      window.setTimeout(() => setSpeaking(false), Math.min(8000, 1200 + line.text.length * 45))
    },
    [allLessonLines, showLine, speakStepLine, lesson.id, stepId]
  )

  useEffect(() => {
    setLineIndex(0)
    const first = lines[0]
    if (first) {
      speakDialogueLine(first, 0)
    } else {
      setBubble('')
      setBoard({ title: step.title, speaking: false })
    }
    // فقط با عوض شدن step/band — نه lines/speakDialogueLine (مرجع ناپایدار نباشد)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      speakDialogueLine(lines[next]!, next)
      return
    }
    go(1)
  }

  return (
    <div className="lesson-classroom" dir="rtl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-xs font-bold text-white/70">
            {lesson.code} · {lesson.duration}
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
        </div>
      </div>

      <div className="lesson-classroom__grid">
        <aside className="lesson-classroom__avatar-col">
          {isWrapUp ? (
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
            <ClassroomScene
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

            {step.brief && (stepId === 'challenge-a' || stepId === 'challenge-b') ? (
              <p className="mb-4 rounded-xl border border-orange-300/40 bg-orange-500/20 px-4 py-3 text-center text-sm font-extrabold leading-7 text-white">
                {step.brief}
              </p>
            ) : null}

            {!showRunner && lines[lineIndex] ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center px-4 text-center">
                <p className="text-base leading-8 text-white/90 md:text-lg">{lines[lineIndex]?.text}</p>
              </div>
            ) : null}

            {showRunner ? (
              <PythonCodeRunner
                key={stepId}
                mode={stepId === 'demo' ? 'demo' : 'interactive'}
                band={bandFocus}
                lessonProfile="python-01-intro"
                mission={step.stageMission || step.brief}
                checklist={
                  step.missionChecklist ??
                  (stepId === 'challenge-a' || stepId === 'challenge-b'
                    ? [
                        { id: 'prints3', label: 'حداقل ۳ خط print' },
                        { id: 'said', label: 'بدون قفل مینی' },
                        ...(stepId === 'challenge-b'
                          ? [{ id: 'has-comment', label: 'یک خط # یادداشت' }]
                          : []),
                      ]
                    : undefined)
                }
                initialCode=""
                onNarrate={narrateFromText}
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

            {lessonFinished ? (
              <div className="mt-4 flex justify-center gap-3">
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

function Python01Classroom({ lang }: { lang: string }) {
  return (
    <ClassroomBoardProvider>
      <Python01ClassroomInner lang={lang} />
    </ClassroomBoardProvider>
  )
}

export function Python01IntroLessonView({ lang }: { lang: string }) {
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
          <span className="text-white/90">PY-01</span>
        </nav>
        <Python01Classroom lang={lang} />
      </div>
    </ChatProvider>
  )
}
