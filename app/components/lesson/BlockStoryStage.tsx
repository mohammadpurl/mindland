'use client'

import Image from 'next/image'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Trash2 } from 'lucide-react'
import { BrokenShowOverlay } from '@/app/components/lesson/BrokenShowOverlay'

const ACTOR_SRC = '/charackter/char.png'
const ACTOR_SIZE = 56

export type StageBlockKind = 'move' | 'turn' | 'say' | 'if-edge' | 'repeat'
export type StageMode = 'demo' | 'guided' | 'challenge-a' | 'challenge-b'

export interface StageBlock {
  id: string
  kind: StageBlockKind
  label: string
  speech?: string
  times?: number
  children?: StageBlock[]
}

export interface MissionGoal {
  id: string
  label: string
}

export const SYSTEM_MESSAGES = {
  'crash-edge': 'نمایش خراب شد! مینی نمی‌دونست به لبه که رسید چیکار کنه.',
  'crash-empty-repeat': 'مینی منتظر موند... هیچ‌کاری براش تعریف نشده بود.',
} as const

const BLOCK_MOVE: Omit<StageBlock, 'id'> = { kind: 'move', label: 'برو جلو' }
const BLOCK_TURN: Omit<StageBlock, 'id'> = { kind: 'turn', label: 'بچرخ' }
const BLOCK_SAY_READY: Omit<StageBlock, 'id'> = {
  kind: 'say',
  label: 'بگو: آماده‌ام!',
  speech: 'آماده‌ام!',
}
const BLOCK_SAY_HI: Omit<StageBlock, 'id'> = {
  kind: 'say',
  label: 'بگو: سلام!',
  speech: 'سلام!',
}
const BLOCK_IF_EDGE: Omit<StageBlock, 'id'> = {
  kind: 'if-edge',
  label: 'اگر به لبه رسیدی، برگرد',
}
const BLOCK_REPEAT: Omit<StageBlock, 'id'> = {
  kind: 'repeat',
  label: '۲ بار تکرار کن',
  times: 2,
  children: [],
}

function paletteFor(mode: StageMode): Omit<StageBlock, 'id'>[] {
  if (mode === 'challenge-a') {
    return [BLOCK_TURN, BLOCK_SAY_HI, BLOCK_REPEAT, BLOCK_MOVE]
  }
  if (mode === 'challenge-b') {
    return [BLOCK_MOVE, BLOCK_TURN, BLOCK_SAY_READY, BLOCK_IF_EDGE, BLOCK_REPEAT]
  }
  return [BLOCK_MOVE, BLOCK_TURN, BLOCK_SAY_READY, BLOCK_IF_EDGE, BLOCK_REPEAT]
}

type ScriptState = { blocks: StageBlock[] }

type ScriptAction =
  | { type: 'add'; block: Omit<StageBlock, 'id'> }
  | { type: 'remove'; id: string }
  | { type: 'move'; from: number; to: number }
  | { type: 'clear' }
  | { type: 'set'; blocks: StageBlock[] }
  | { type: 'add-into-repeat'; repeatId: string; block: Omit<StageBlock, 'id'> }

function uid() {
  return `b-${Math.random().toString(36).slice(2, 9)}`
}

function withId(block: Omit<StageBlock, 'id'>): StageBlock {
  return {
    ...block,
    id: uid(),
    children: block.children ? [] : undefined,
  }
}

function makeRepeat(times: number, children: Array<Omit<StageBlock, 'id'>>): StageBlock {
  return {
    ...withId({
      ...BLOCK_REPEAT,
      times,
      label: `${times} بار تکرار کن`,
      children: [],
    }),
    children: children.map((c) => withId(c)),
  }
}

function scriptReducer(state: ScriptState, action: ScriptAction): ScriptState {
  switch (action.type) {
    case 'add':
      return { blocks: [...state.blocks, withId(action.block)] }
    case 'remove':
      return { blocks: state.blocks.filter((b) => b.id !== action.id) }
    case 'clear':
      return { blocks: [] }
    case 'set':
      return { blocks: action.blocks }
    case 'move': {
      const next = [...state.blocks]
      const [item] = next.splice(action.from, 1)
      if (!item) return state
      next.splice(action.to, 0, item)
      return { blocks: next }
    }
    case 'add-into-repeat': {
      return {
        blocks: state.blocks.map((b) => {
          if (b.id !== action.repeatId || b.kind !== 'repeat') return b
          return { ...b, children: [...(b.children ?? []), withId(action.block)] }
        }),
      }
    }
    default:
      return state
  }
}

type Actor = { x: number; y: number; angle: number; bubble: string | null }

const STAGE_W = 320
const STAGE_H = 200
const STEP = 36
const MARGIN = ACTOR_SIZE / 2 + 4

function atEdge(x: number, y: number) {
  return x <= MARGIN || x >= STAGE_W - MARGIN || y <= MARGIN || y >= STAGE_H - MARGIN
}

function clampPos(x: number, y: number) {
  return {
    x: Math.min(STAGE_W - MARGIN, Math.max(MARGIN, x)),
    y: Math.min(STAGE_H - MARGIN, Math.max(MARGIN, y)),
  }
}

function hasEdgeRule(blocks: StageBlock[]): boolean {
  return blocks.some((b) => b.kind === 'if-edge' || (b.children && hasEdgeRule(b.children)))
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function makeBlocks(kinds: Array<'move' | 'turn' | 'say-ready' | 'say-hi' | 'if-edge'>): StageBlock[] {
  return kinds.map((k) => {
    if (k === 'move') return withId(BLOCK_MOVE)
    if (k === 'turn') return withId(BLOCK_TURN)
    if (k === 'say-ready') return withId(BLOCK_SAY_READY)
    if (k === 'say-hi') return withId(BLOCK_SAY_HI)
    return withId(BLOCK_IF_EDGE)
  })
}

const DEFAULT_CHECKLIST: MissionGoal[] = [
  { id: 'moved', label: 'جلو رفت' },
  { id: 'turned', label: 'چرخید' },
  { id: 'said', label: 'آماده‌ام رو گفت' },
  { id: 'safe', label: 'بدون خرابی تموم شد' },
  { id: 'repeated', label: 'با تکرار ساخت (نه کپی جدا)' },
]

type RunResult = {
  actor: Actor
  crashed: boolean
  crashId?: keyof typeof SYSTEM_MESSAGES
  did: { moved: boolean; turned: boolean; said: boolean; repeated: boolean }
}

export function BlockStoryStage({
  mode = 'guided',
  mission,
  checklist = DEFAULT_CHECKLIST,
  onNarrate,
}: {
  mode?: StageMode
  mission?: string
  checklist?: MissionGoal[]
  onNarrate?: (text: string) => void
}) {
  const palette = paletteFor(mode)
  const [script, dispatch] = useReducer(scriptReducer, { blocks: [] })
  const [actor, setActor] = useState<Actor>({
    x: STAGE_W / 2,
    y: STAGE_H / 2,
    angle: 0,
    bubble: null,
  })
  const [running, setRunning] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [crashMessage, setCrashMessage] = useState<string | null>(null)
  const [caption, setCaption] = useState(mission ?? '')
  const [done, setDone] = useState<Record<string, boolean>>({})
  const cancelRef = useRef(false)

  useEffect(() => {
    dispatch({ type: 'clear' })
    setCrashMessage(null)
    setDone({})
    setActor({ x: STAGE_W / 2, y: STAGE_H / 2, angle: 0, bubble: null })
    if (mission) setCaption(mission)
  }, [mode, mission])

  const resetActor = useCallback(() => {
    setActor({ x: STAGE_W / 2, y: STAGE_H / 2, angle: 0, bubble: null })
  }, [])

  const runBlocks = useCallback(
    async (blocks: StageBlock[], current: Actor, edgeProtected: boolean): Promise<RunResult> => {
      let state = { ...current }
      const did = { moved: false, turned: false, said: false, repeated: false }

      for (const block of blocks) {
        if (cancelRef.current) break

        switch (block.kind) {
          case 'move': {
            const rad = (state.angle * Math.PI) / 180
            const nextX = state.x + Math.cos(rad) * STEP
            const nextY = state.y + Math.sin(rad) * STEP
            const wouldExit =
              nextX < MARGIN ||
              nextX > STAGE_W - MARGIN ||
              nextY < MARGIN ||
              nextY > STAGE_H - MARGIN
            const pos = clampPos(nextX, nextY)
            if (wouldExit) {
              if (edgeProtected) {
                state = {
                  ...state,
                  ...pos,
                  angle: (state.angle + 180) % 360,
                  bubble: null,
                }
                setActor(state)
                did.moved = true
                await sleep(320)
              } else {
                state = { ...state, ...pos, bubble: null }
                setActor(state)
                await sleep(200)
                return { actor: state, crashed: true, crashId: 'crash-edge', did }
              }
            } else {
              state = { ...state, x: pos.x, y: pos.y, bubble: null }
              setActor(state)
              did.moved = true
              await sleep(380)
            }
            break
          }
          case 'turn': {
            state = { ...state, angle: (state.angle + 90) % 360, bubble: null }
            setActor(state)
            did.turned = true
            await sleep(320)
            break
          }
          case 'say': {
            const speech = block.speech ?? 'آماده‌ام!'
            state = { ...state, bubble: speech }
            setActor(state)
            if (speech.includes('آماده‌ام')) did.said = true
            await sleep(700)
            state = { ...state, bubble: null }
            setActor(state)
            break
          }
          case 'if-edge': {
            if (atEdge(state.x, state.y)) {
              state = { ...state, angle: (state.angle + 180) % 360, bubble: null }
              setActor(state)
              await sleep(320)
            }
            break
          }
          case 'repeat': {
            const times = block.times ?? 2
            const inner = block.children ?? []
            if (inner.length === 0) {
              return { actor: state, crashed: true, crashId: 'crash-empty-repeat', did }
            }
            did.repeated = true
            for (let i = 0; i < times; i++) {
              if (cancelRef.current) break
              const innerResult = await runBlocks(inner, state, edgeProtected)
              state = innerResult.actor
              did.moved = did.moved || innerResult.did.moved
              did.turned = did.turned || innerResult.did.turned
              did.said = did.said || innerResult.did.said
              did.repeated = did.repeated || innerResult.did.repeated
              if (innerResult.crashed) return { ...innerResult, did }
            }
            break
          }
        }
      }

      return { actor: state, crashed: false, did }
    },
    []
  )

  async function playScript(blocks: StageBlock[], options?: { silentCaption?: string }) {
    if (running) return
    cancelRef.current = false
    setRunning(true)
    setCrashMessage(null)
    setShaking(false)
    if (options?.silentCaption) setCaption(options.silentCaption)
    resetActor()
    await sleep(180)
    const start: Actor = { x: STAGE_W / 2, y: STAGE_H / 2, angle: 0, bubble: null }
    const edgeProtected = hasEdgeRule(blocks)
    const result = await runBlocks(blocks, start, edgeProtected)
    setRunning(false)

    if (result.crashed) {
      setShaking(true)
      window.setTimeout(() => setShaking(false), 500)
      const msg = SYSTEM_MESSAGES[result.crashId ?? 'crash-edge']
      setCrashMessage(msg)
      setCaption(msg)
      return result
    }

    if (mode === 'guided') {
      setDone((prev) => {
        const moved = prev.moved || result.did.moved
        const turned = prev.turned || result.did.turned
        const said = prev.said || result.did.said
        const repeated = prev.repeated || result.did.repeated
        return {
          ...prev,
          moved,
          turned,
          said,
          repeated,
          safe: moved && turned && said,
        }
      })
      setCaption(
        result.did.repeated
          ? 'تمیز! همون کار با تکرار.'
          : 'اجرا تموم شد. برای «با تکرار»، یک بلوک تکرار با حرکت داخلش بساز.'
      )
    } else {
      setCaption(mission ?? 'تموم شد.')
    }
    return result
  }

  async function handleRun() {
    if (script.blocks.length === 0) {
      setCaption('اول حداقل یک بلوک بچین.')
      return
    }
    await playScript(script.blocks)
  }

  function handleRetry() {
    cancelRef.current = true
    setCrashMessage(null)
    setShaking(false)
    setRunning(false)
    resetActor()
    setCaption(mission ?? 'دوباره تمرین کن.')
  }

  async function runDemo(
    kind: 'good' | 'bad' | 'edgeCrash' | 'edgeSafe' | 'repeatVerbose' | 'repeatClean'
  ) {
    const map: Record<typeof kind, StageBlock[]> = {
      good: makeBlocks(['move', 'turn', 'say-ready']),
      bad: makeBlocks(['say-ready', 'turn', 'move']),
      edgeCrash: makeBlocks(['move', 'move', 'move', 'move', 'move', 'move', 'move']),
      edgeSafe: [
        ...makeBlocks(['move', 'move', 'move', 'move', 'move', 'move', 'move']),
        withId(BLOCK_IF_EDGE),
      ],
      repeatVerbose: makeBlocks(['turn', 'say-hi', 'turn', 'say-hi']),
      repeatClean: [makeRepeat(2, [BLOCK_TURN, BLOCK_SAY_HI])],
    }

    const captions: Record<typeof kind, string> = {
      good: 'ترتیب درست: جلو → بچرخ → آماده‌ام',
      bad: 'ترتیب غلط (خنده‌دار): آماده‌ام → بچرخ → جلو',
      edgeCrash: 'بدون قانون لبه…',
      edgeSafe: 'با قانون لبه',
      repeatVerbose: 'چهار بلوک جدا: بچرخ → سلام → بچرخ → سلام',
      repeatClean: 'یک تکرار: ۲ بار (بچرخ + سلام)',
    }

    const blocks = map[kind]
    dispatch({ type: 'set', blocks })
    const result = await playScript(blocks, { silentCaption: captions[kind] })

    if (kind === 'good' && !result?.crashed) {
      onNarrate?.('این شد.')
      setCaption('این شد.')
    }
    if (kind === 'bad' && !result?.crashed) {
      onNarrate?.(
        'هر دو بار بلوک‌های یکسان بودن. فقط ترتیبشون فرق داشت. مینی هیچ اشتباهی نکرد — دقیقاً همونی که گفتیم رو انجام داد.'
      )
    }
    if (kind === 'edgeSafe' && !result?.crashed) {
      onNarrate?.('با قانون «اگر به لبه رسید، برگرد» همون مسیر خراب نمی‌شه.')
      setCaption('با قانون لبه، نمایش خراب نشد.')
    }
    if (kind === 'repeatVerbose' && !result?.crashed) {
      onNarrate?.('همون رقص شد… ولی دستور پخت شلوغه. چهار تا بلوک برای دو بار کار یکسان.')
      setCaption('شلوغ: چهار بلوک جدا')
    }
    if (kind === 'repeatClean' && !result?.crashed) {
      onNarrate?.(
        'همون نمایش. فقط این‌بار یک‌بار گفتیم چیکار کن، و گفتیم دو بار تکرار کن. تمیزتره.'
      )
      setCaption('تمیز: یک تکرار')
    }
  }

  const showChecklist = mode === 'guided'
  const showBuilder = mode !== 'demo' || script.blocks.length > 0

  return (
    <div className="rounded-2xl border border-teal-200 bg-white/95 p-4 shadow-sm md:p-5" dir="rtl">
      {mission ? (
        <p className="mb-3 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-center text-sm font-extrabold text-teal-900">
          {mission}
        </p>
      ) : null}

      {showChecklist ? (
        <ul className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          {checklist.map((g) => {
            const ok = !!done[g.id]
            return (
              <li
                key={g.id}
                className={[
                  'rounded-lg px-2.5 py-1',
                  ok ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600',
                ].join(' ')}
              >
                {ok ? '✅' : '⬜'} {g.label}
              </li>
            )
          })}
        </ul>
      ) : null}

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-extrabold text-slate-800">صحنهٔ مینی</h3>
        <p className="text-xs font-bold text-teal-800" aria-live="polite">
          {caption}
        </p>
      </div>

      <motion.div
        className="relative mx-auto overflow-hidden rounded-xl border border-sky-200"
        animate={shaking ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: '100%',
          maxWidth: STAGE_W,
          aspectRatio: `${STAGE_W} / ${STAGE_H}`,
          background: 'linear-gradient(180deg, #E0F2FE 0%, #F0FDF4 55%, #FEF9C3 100%)',
        }}
        role="img"
        aria-label="صحنهٔ تمرین مینی"
      >
        <div className="pointer-events-none absolute inset-2 rounded-lg border-2 border-dashed border-sky-300/70" />
        <div
          className="absolute transition-transform duration-300 drop-shadow-md"
          style={{
            left: actor.x,
            top: actor.y,
            width: ACTOR_SIZE,
            height: ACTOR_SIZE,
            transform: `translate(-50%, -50%) rotate(${actor.angle}deg)`,
          }}
        >
          <Image
            src={ACTOR_SRC}
            alt="مینی"
            width={ACTOR_SIZE}
            height={ACTOR_SIZE}
            className="h-full w-full object-contain"
            priority
            draggable={false}
          />
        </div>
        {actor.bubble ? (
          <div
            className="absolute rounded-xl bg-white px-2 py-1 text-xs font-bold text-slate-800 shadow"
            style={{ left: actor.x + ACTOR_SIZE / 2, top: actor.y - ACTOR_SIZE / 2 - 8 }}
          >
            {actor.bubble}
          </div>
        ) : null}

        {crashMessage ? (
          <BrokenShowOverlay
            message={crashMessage}
            retryLabel="🔁 نمایش رو دوباره تمرین کن"
            onRetry={handleRetry}
          />
        ) : null}
      </motion.div>

      {mode === 'demo' ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={running}
            onClick={() => runDemo('good')}
            className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۱) ترتیب درست
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => runDemo('bad')}
            className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۲) ترتیب غلط
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => runDemo('edgeCrash')}
            className="rounded-xl bg-slate-700 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۳) بدون قانون لبه
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => runDemo('edgeSafe')}
            className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۴) با قانون لبه
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => runDemo('repeatVerbose')}
            className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۵) تکرار شلوغ
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => runDemo('repeatClean')}
            className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۶) تکرار تمیز
          </button>
        </div>
      ) : null}

      {mode !== 'demo' || showBuilder ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-extrabold text-slate-600">جعبهٔ بلوک‌ها</p>
            <ul className="flex flex-wrap gap-2">
              {palette.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    disabled={running || mode === 'demo'}
                    onClick={() => dispatch({ type: 'add', block: p })}
                    className="rounded-xl px-3 py-2 text-xs font-extrabold text-white shadow-sm disabled:opacity-50"
                    style={{
                      backgroundColor:
                        p.kind === 'move'
                          ? '#0D9488'
                          : p.kind === 'turn'
                            ? '#0284C7'
                            : p.kind === 'say'
                              ? '#EA580C'
                              : p.kind === 'if-edge'
                                ? '#475569'
                                : '#DB2777',
                    }}
                  >
                    + {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-extrabold text-slate-600">دستور پخت (از بالا به پایین)</p>
            {script.blocks.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">هنوز بلوکی نچیده‌ای...</p>
            ) : (
              <ol className="space-y-2">
                {script.blocks.map((b, index) => (
                  <li key={b.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-xs font-bold text-slate-800">{b.label}</span>
                      {mode !== 'demo' ? (
                        <>
                          <button
                            type="button"
                            disabled={running || index === 0}
                            className="text-[10px] font-bold text-sky-700 disabled:opacity-30"
                            onClick={() => dispatch({ type: 'move', from: index, to: index - 1 })}
                          >
                            بالا
                          </button>
                          <button
                            type="button"
                            disabled={running || index === script.blocks.length - 1}
                            className="text-[10px] font-bold text-sky-700 disabled:opacity-30"
                            onClick={() => dispatch({ type: 'move', from: index, to: index + 1 })}
                          >
                            پایین
                          </button>
                          <button
                            type="button"
                            disabled={running}
                            aria-label="حذف"
                            onClick={() => dispatch({ type: 'remove', id: b.id })}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : null}
                    </div>
                    {b.kind === 'repeat' && mode !== 'demo' ? (
                      <div className="mt-2 mr-8 space-y-1 rounded-lg border border-dashed border-pink-300 bg-pink-50/80 p-2">
                        <p className="text-[10px] font-bold text-pink-800">داخل تکرار:</p>
                        {(b.children ?? []).length === 0 ? (
                          <p className="text-[10px] text-pink-700/80">خالی</p>
                        ) : (
                          <ul className="space-y-1">
                            {b.children!.map((c) => (
                              <li key={c.id} className="text-[10px] font-bold text-pink-950">
                                • {c.label}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {palette
                            .filter((p) => p.kind === 'move' || p.kind === 'turn' || p.kind === 'say')
                            .map((p) => (
                              <button
                                key={p.label}
                                type="button"
                                disabled={running}
                                onClick={() =>
                                  dispatch({ type: 'add-into-repeat', repeatId: b.id, block: p })
                                }
                                className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-pink-800 ring-1 ring-pink-200"
                              >
                                + {p.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ) : null}

      {mode !== 'demo' ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={running}
            onClick={handleRun}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
          >
            <Play className="h-4 w-4" aria-hidden />
            اجرای نمایش
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            از نو
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => dispatch({ type: 'clear' })}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
          >
            پاک کردن بلوک‌ها
          </button>
        </div>
      ) : null}
    </div>
  )
}
