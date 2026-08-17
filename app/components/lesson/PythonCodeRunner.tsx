'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { usePyodide } from '@/hooks/usePyodide'
import { explainPythonError } from '@/lib/pythonErrorMessages'
import {
  evaluateMissionChecks,
  extractErrorLine,
  type MissionCheckId,
} from '@/lib/pythonMissionChecks'
import { findInputCalls } from '@/lib/pythonInputFallback'
import {
  hasLoopStructure,
  isInfiniteLoopError,
  parseNeedInputPrompt,
  SAFE_RUNNER_LIMITS,
  wrapWithSafePreamble,
} from '@/lib/pythonSafeRunner'
import {
  MINDLAND_TURTLE_PREFIX,
  wrapWithTurtlePreamble,
} from '@/lib/pythonTurtleRuntime'
import { TurtleCanvas } from '@/app/components/lesson/TurtleCanvas'
import { BrokenShowOverlay } from '@/app/components/lesson/BrokenShowOverlay'
import { MiniSpeakStage } from '@/app/components/lesson/MiniSpeakStage'

export type CodeRunnerMode = 'demo' | 'interactive'

export type RunnerLessonProfile =
  | 'python-01-intro'
  | 'python-02-print-strings'
  | 'python-03-variables'
  | 'python-04-numbers'
  | 'python-05-input'
  | 'python-06-conditions'
  | 'python-07-for-loop'
  | 'python-08-while-loop'
  | 'python-09-lists'
  | 'python-10-dicts'
  | 'python-11-functions'
  | 'python-12-mini-project'
  | 'python-13-turtle'
  | 'python-14-capstone'

export interface MissionGoal {
  id: string
  label: string
}

export interface DemoSnippet {
  id: string
  label: string
  code: string
  narrate?: string
}

const DEMO_BY_LESSON: Record<RunnerLessonProfile, DemoSnippet[]> = {
  'python-01-intro': [
    {
      id: 'good',
      label: '۱) اجرای درست',
      code: 'print("سلام! من مینی‌ام.")',
      narrate: 'این شد.',
    },
    {
      id: 'bad',
      label: '۲) یه علامت کم',
      code: 'print("سلام! من مینی‌ام.)',
      narrate:
        'جمله‌ی ما تقریباً همون بود. فقط یه علامت کم داشت. برای مینی، تقریباً یعنی نه.',
    },
  ],
  'python-02-print-strings': [
    {
      id: 'good',
      label: '۱) کارت کامل',
      code: [
        'print("تولدت مبارک، آرش!")',
        'print("امیدوارم امسال پر از خنده باشه.")',
        'print("دوستت دارم!")',
      ].join('\n'),
      narrate: 'هر سه خط رو خوند — کارت کامل.',
    },
    {
      id: 'bad',
      label: '۲) نگهبان ناجور',
      code: [
        'print("تولدت مبارک، آرش!")',
        `print('امیدوارم امسال پر از خنده باشه.")`,
        'print("دوستت دارم!")',
      ].join('\n'),
      narrate:
        'دیدی؟ خط اول کامل خونده شد. خط دوم دو تا نگهبان ناجور داشت — مینی همون‌جا قفل کرد.',
    },
  ],
  'python-03-variables': [
    {
      id: 'manual',
      label: '۱) بدون جعبه',
      code: [
        'print("سلام، آرش هستم!")',
        'print("آرش امروز ۱۰ سالشه.")',
        'print("تولد آرش رو تبریک بگو!")',
      ].join('\n'),
      narrate: 'باز بنویسم آرش... دوباره... بازم... اگه اسم بشه سارا، چندجا رو باید عوض کنم؟',
    },
    {
      id: 'with-box',
      label: '۲) با جعبه',
      code: [
        'name = "آرش"',
        'print("سلام، " + name + " هستم!")',
        'print(name + " امروز ۱۰ سالشه.")',
        'print("تولد " + name + " رو تبریک بگو!")',
      ].join('\n'),
      narrate: 'همین نتیجه، ولی اسم فقط یه‌جا نوشته شده.',
    },
    {
      id: 'rename',
      label: '۳) عوض کردن اسم',
      code: [
        'name = "سارا"',
        'print("سلام، " + name + " هستم!")',
        'print(name + " امروز ۱۰ سالشه.")',
        'print("تولد " + name + " رو تبریک بگو!")',
      ].join('\n'),
      narrate:
        'فقط یه‌جا رو عوض کردم، ولی هر سه خط خودشون به‌روز شدن. چون از همون جعبه می‌خوندن.',
    },
  ],
  'python-04-numbers': [
    {
      id: 'text-add',
      label: '۱) متن عددی',
      code: 'print("۵" + "۳")',
      narrate: 'این که جمعشون نکرد! فقط چسبوندشون به هم!',
    },
    {
      id: 'number-add',
      label: '۲) عدد واقعی',
      code: 'print(5 + 3)',
      narrate:
        'وقتی بدون گیومه نوشتیم، مینی فهمید عددن و واقعاً جمع زد. شکلشون شبیه بود، ولی برای مینی کاملاً فرق داشتن.',
    },
  ],
  'python-05-input': [
    {
      id: 'fixed',
      label: '۱) بدون سؤال',
      code: 'print("سلام آرش! خوش اومدی.")',
      narrate: 'این جالبه، ولی مینی همیشه فقط به آرش سلام می‌کنه. اگه من بودم چی؟',
    },
    {
      id: 'with-input',
      label: '۲) با سؤال واقعی',
      code: [
        'name = input("اسمت چیه؟ ")',
        'print("سلام " + name + "! خوش اومدی.")',
      ].join('\n'),
      narrate:
        'دیدی؟ این‌بار مینی صبر کرد تا تو جواب بدی، و بعد از جواب تو استفاده کرد.',
    },
  ],
  'python-06-conditions': [
    {
      id: 'fixed',
      label: '۱) بدون شرط',
      code: [
        'age = input("چند سالته؟ ")',
        'print("باشه، خوش اومدی!")',
      ].join('\n'),
      narrate: 'مینی اصلاً اهمیتی نداد چند سالمون گفتیم. همیشه همون جمله رو گفت.',
    },
    {
      id: 'with-if',
      label: '۲) با شرط',
      code: [
        'age = int(input("چند سالته؟ "))',
        'if age < 13:',
        '    print("خوش اومدی رفیق کوچولو!")',
        'else:',
        '    print("خوش اومدی!")',
      ].join('\n'),
      narrate: 'دیدی؟ این‌بار مینی واقعاً به جوابت گوش داد و بر اساسش یه تصمیم گرفت.',
    },
  ],
  'python-07-for-loop': [
    {
      id: 'manual',
      label: '۱) بدون حلقه',
      code: ['print("*")', 'print("*")', 'print("*")', 'print("*")', 'print("*")'].join('\n'),
      narrate: 'بازم بنویسم... بازم... حالا اگه بخوام این‌کارو ۵۰ بار بکنم چی؟ باید ۵۰ خط بنویسم؟',
    },
    {
      id: 'loop-five',
      label: '۲) با حلقه',
      code: ['for i in range(5):', '    print("*")'].join('\n'),
      narrate: 'همون ۵ ستاره، ولی با دو خط کد.',
    },
    {
      id: 'loop-fifty',
      label: '۳) فقط عدد رو عوض کن',
      code: ['for i in range(50):', '    print("*")'].join('\n'),
      narrate:
        'دیدی؟ با تغییر یه عدد، از ۵ تا رسیدیم به ۵۰ تا، بدون این‌که ۵۰ خط بنویسیم. این قدرت حلقه‌ست.',
    },
  ],
  'python-08-while-loop': [
    {
      id: 'once',
      label: '۱) فقط یک شانس',
      code: [
        'guess = int(input("عدد بین ۱ تا ۱۰ رو حدس بزن: "))',
        'if guess == 7:',
        '    print("درست حدس زدی!")',
        'else:',
        '    print("اشتباه بود. باختی!")',
      ].join('\n'),
      narrate: 'این که خیلی سخت‌گیرانه‌ست! فقط یه شانس داشتیم.',
    },
    {
      id: 'with-while',
      label: '۲) با while',
      code: [
        'guess = int(input("عدد بین ۱ تا ۱۰ رو حدس بزن: "))',
        'while guess != 7:',
        '    print("اشتباه بود، دوباره امتحان کن.")',
        '    guess = int(input("حدس بعدی: "))',
        'print("درست حدس زدی!")',
      ].join('\n'),
      narrate:
        'دیدی؟ این‌بار مینی تا وقتی شرط برقرار بود ادامه داد. وقتی شرط تموم شد، خودش ایستاد.',
    },
  ],
  'python-09-lists': [
    {
      id: 'separate',
      label: '۱) جعبه‌های جدا',
      code: 'f1 = "آرش"\nf2 = "سارا"\nf3 = "مهراد"\nprint(f1)\nprint(f2)\nprint(f3)',
      narrate: 'کار می‌کرد، ولی هر بار باید اسم هر جعبه رو جدا می‌نوشتی.',
    },
    {
      id: 'with-list',
      label: '۲) یک لیست',
      code: 'friends = ["آرش", "سارا", "مهراد"]\nfor name in friends:\n    print(name)',
      narrate: 'حالا همه تو یه لیستن — با for یکی‌یکی صدا می‌زنیم.',
    },
  ],
  'python-10-dicts': [
    {
      id: 'separate',
      label: '۱) متغیرهای جدا',
      code: 'name = "آرش"\nage = 10\ncity = "تهران"\nprint(name, age, city)',
      narrate: 'سه جعبهٔ جدا — برای هر کارت بازیکن باید چند تا جعبه بسازی.',
    },
    {
      id: 'with-dict',
      label: '۲) یک دیکشنری',
      code: 'player = {"name": "آرش", "age": 10, "city": "تهران"}\nprint(player["name"])\nprint(player["age"])',
      narrate: 'حالا همهٔ فیلدها تو یه دفترچه‌ان — با کلید صدا می‌زنی.',
    },
  ],
  'python-11-functions': [
    {
      id: 'repeat',
      label: '۱) بدون تابع',
      code: 'print("سلام آرش!")\nprint("سلام سارا!")\nprint("سلام مهراد!")',
      narrate: 'همون جمله رو سه بار با اسم‌های مختلف نوشتیم.',
    },
    {
      id: 'with-def',
      label: '۲) با تابع',
      code: 'def greet(name):\n    print("سلام " + name + "!")\n\ngreet("آرش")\ngreet("سارا")\ngreet("مهراد")',
      narrate: 'یه بار تابع رو نوشتیم، بعد هر بار فقط صدا زدیم.',
    },
  ],
  'python-12-mini-project': [
    {
      id: 'skeleton',
      label: '۱) اسکلت منو',
      code: 'print("1. جمع")\nprint("2. تفریق")\nprint("3. خروج")',
      narrate: 'اول منو — بعد تابع و حلقه رو اضافه می‌کنی.',
    },
    {
      id: 'mini-calc',
      label: '۲) جمع ساده',
      code: [
        'def add(a, b):',
        '    return a + b',
        'a = int(input("عدد اول: "))',
        'b = int(input("عدد دوم: "))',
        'print(add(a, b))',
      ].join('\n'),
      narrate: 'تابع + input + print — همین‌ها رو تو پروژهٔ کامل ترکیب می‌کنی.',
    },
  ],
  'python-13-turtle': [
    {
      id: 'square',
      label: '۱) مربع',
      code: [
        'import turtle',
        't = turtle.Turtle()',
        'for _ in range(4):',
        '    t.forward(100)',
        '    t.right(90)',
      ].join('\n'),
      narrate: 'لاک‌پشت چهار ضلع کشید — مربع!',
    },
    {
      id: 'star',
      label: '۲) ستاره',
      code: [
        'import turtle',
        't = turtle.Turtle()',
        'for _ in range(5):',
        '    t.forward(80)',
        '    t.right(144)',
      ].join('\n'),
      narrate: 'با forward و right یه ستاره ساختیم.',
    },
  ],
  'python-14-capstone': [
    {
      id: 'checklist',
      label: '۱) چک‌لیست',
      code: '# پروژهٔ من: ...\n# حداقل: ۱ تابع + ۱ لیست یا dict\n',
      narrate: 'اول ایده و چک‌لیست — بعد می‌سازی.',
    },
  ],
}

const RANGE_ZERO_TIP =
  'مینی از صفر شمارش می‌کنه، نه از یک — برای همین range(5) دقیقاً ۵ بار تکرار می‌شه، ولی از ۰ تا ۴.'

function speakLinesFromOutput(output: string): string[] {
  return output
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.includes(MINDLAND_TURTLE_PREFIX))
}

function prepareSource(source: string, lessonProfile: RunnerLessonProfile): string {
  if (lessonProfile === 'python-13-turtle') {
    return wrapWithTurtlePreamble(source)
  }
  return source
}

const DEFAULT_CHECKLIST: MissionGoal[] = [
  { id: 'typed', label: 'کد رو تایپ کردم' },
  { id: 'ran', label: 'اجرا کردم' },
  { id: 'said', label: 'مینی درست گفتش (بدون خطا)' },
]

function checklistIds(checklist: MissionGoal[]): MissionCheckId[] {
  return checklist.map((c) => c.id as MissionCheckId)
}

export function PythonCodeRunner({
  mode = 'interactive',
  band = 'A',
  lessonProfile = 'python-01-intro',
  mission,
  checklist = DEFAULT_CHECKLIST,
  initialCode = '',
  sequential = false,
  onNarrate,
}: {
  mode?: CodeRunnerMode
  band?: 'A' | 'B'
  lessonProfile?: RunnerLessonProfile
  mission?: string
  checklist?: MissionGoal[]
  /** خالی بگذار تا دانش‌آموز خودش بنویسد — اسکلت حداقلی نده */
  initialCode?: string
  /** اجرای خط‌به‌خط (پیش‌فرض برای PY-02 تا PY-04) */
  sequential?: boolean
  onNarrate?: (text: string) => void
}) {
  const useSequential =
    sequential ||
    lessonProfile === 'python-02-print-strings' ||
    lessonProfile === 'python-03-variables' ||
    lessonProfile === 'python-04-numbers'

  const { runCode, runCodeSequential, isBusy, status, ensureReady, loadError } = usePyodide()
  const demos = DEMO_BY_LESSON[lessonProfile]
  const [code, setCode] = useState(initialCode)
  const [spokenLines, setSpokenLines] = useState<string[]>([])
  const [locked, setLocked] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [crashMessage, setCrashMessage] = useState<string | null>(null)
  const [rawError, setRawError] = useState<string | null>(null)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [caption, setCaption] = useState(mission ?? '')
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [demoCode, setDemoCode] = useState(demos[0]?.code ?? '')
  const [lastSuccessfulCode, setLastSuccessfulCode] = useState<string | undefined>()
  const [inputPrompt, setInputPrompt] = useState<string | null>(null)
  const [inputDraft, setInputDraft] = useState('')
  const [showRangeTip, setShowRangeTip] = useState(false)
  const [turtleOutput, setTurtleOutput] = useState('')
  const inputResolverRef = useRef<((value: string | null) => void) | null>(null)
  const inputFieldRef = useRef<HTMLInputElement | null>(null)

  const askMiniInput = useCallback((prompt: string) => {
    return new Promise<string | null>((resolve) => {
      inputResolverRef.current = resolve
      setInputDraft('')
      setInputPrompt(prompt || 'مینی داره ازت می‌پرسه...')
    })
  }, [])

  const finishInput = useCallback((value: string | null) => {
    const resolve = inputResolverRef.current
    inputResolverRef.current = null
    setInputPrompt(null)
    setInputDraft('')
    resolve?.(value)
  }, [])

  useEffect(() => {
    if (inputPrompt && inputFieldRef.current) {
      inputFieldRef.current.focus()
    }
  }, [inputPrompt])

  useEffect(() => {
    setCode(initialCode)
    setSpokenLines([])
    setLocked(false)
    setCrashMessage(null)
    setRawError(null)
    setErrorLine(null)
    setDone({})
    setLastSuccessfulCode(undefined)
    setShowRangeTip(false)
    setTurtleOutput('')
    setDemoCode(demos[0]?.code ?? '')
    if (mission) setCaption(mission)
  }, [mode, mission, initialCode, lessonProfile, demos])

  useEffect(() => {
    void ensureReady().catch(() => undefined)
  }, [ensureReady])

  const crash = useCallback((message: string, raw: string | null, line: number | null) => {
    setLocked(true)
    setShaking(true)
    window.setTimeout(() => setShaking(false), 450)
    setCrashMessage(message)
    setRawError(raw)
    setErrorLine(line)
    setCaption(line ? `${message} (خط ${line})` : message)
  }, [])

  const clearCrash = useCallback(() => {
    setLocked(false)
    setCrashMessage(null)
    setRawError(null)
    setErrorLine(null)
    setCaption(mission ?? '')
  }, [mission])

  const applyChecks = useCallback(
    (source: string, output: string, hasError: boolean) => {
      if (mode !== 'interactive') return
      const evaluated = evaluateMissionChecks(checklistIds(checklist), {
        code: source,
        output,
        hasError,
        previousCode: lastSuccessfulCode,
      })
      setDone((prev) => {
        const next: Record<string, boolean> = {
          ...prev,
          typed: source.trim().length > 0 || !!prev.typed,
          ran: true,
        }
        for (const [key, value] of Object.entries(evaluated)) {
          // یک‌بار تیک‌خورده بماند (مثلاً age-changed بعد از مشاهدهٔ اثر)
          next[key] = Boolean(prev[key]) || Boolean(value)
        }
        return next
      })
      if (!hasError) setLastSuccessfulCode(source)
    },
    [checklist, lastSuccessfulCode, mode]
  )

  const execute = useCallback(
    async (source: string, opts?: { trackTyped?: boolean; narrateOnOk?: string }) => {
      if (!source.trim()) {
        setCaption('اول یه خط کد بنویس.')
        return
      }

      clearCrash()
      setSpokenLines([])
      setTurtleOutput('')

      if (opts?.trackTyped !== false && mode === 'interactive') {
        setDone((prev) => ({ ...prev, typed: true }))
      }

      const prepared = prepareSource(source, lessonProfile)

      const needsSafe =
        findInputCalls(source).length > 0 ||
        hasLoopStructure(source) ||
        lessonProfile === 'python-07-for-loop' ||
        lessonProfile === 'python-08-while-loop' ||
        lessonProfile === 'python-12-mini-project'

      // حلقه/ورودی پویا: محافظ تیک + input با اجرای مجدد (نه جایگزینی ایستا)
      if (needsSafe) {
        const answers: string[] = []
        let result = await runCode(wrapWithSafePreamble(prepared, answers))

        for (let i = 0; i < SAFE_RUNNER_LIMITS.maxDynamicInputs; i++) {
          const needPrompt = parseNeedInputPrompt(result.error)
          if (!needPrompt && !isInfiniteLoopError(result.error)) break
          if (isInfiniteLoopError(result.error)) break
          if (!needPrompt) break

          setCaption('مینی منتظر جوابته...')
          const answer = await askMiniInput(needPrompt || 'مینی داره ازت می‌پرسه...')
          if (answer === null) {
            setCaption('اجرا لغو شد — مینی منتظر جواب موند.')
            return
          }
          answers.push(answer)
          result = await runCode(wrapWithSafePreamble(prepared, answers))
        }

        // اگر هنوز input می‌خواهد → بیش از حد تلاش
        if (parseNeedInputPrompt(result.error)) {
          result = {
            ...result,
            hasError: true,
            error: 'MINDLAND_INFINITE_LOOP',
          }
        }

        const lines =
          result.outputLines ?? speakLinesFromOutput(result.output)
        if (lines.length > 0) setSpokenLines(lines)
        if (lessonProfile === 'python-13-turtle') setTurtleOutput(result.output)

        if (result.hasError && result.error) {
          const line = result.errorLine ?? extractErrorLine(result.error)
          const explained = explainPythonError(result.error, source, { errorLine: line })
          crash(explained.systemMessage, result.error, explained.line ?? line)
          applyChecks(source, result.output, true)
          return
        }

        setCaption('مینی گفت.')
        applyChecks(source, result.output, false)
        if (lessonProfile === 'python-07-for-loop' && /\brange\s*\(/.test(source)) {
          setShowRangeTip(true)
        }
        if (opts?.narrateOnOk) {
          onNarrate?.(opts.narrateOnOk)
          setCaption(opts.narrateOnOk)
        }
        return
      }

      const result = useSequential
        ? await runCodeSequential(prepared)
        : await runCode(prepared)

      const lines = result.outputLines ?? speakLinesFromOutput(result.output)

      if (lines.length > 0) setSpokenLines(lines)
      if (lessonProfile === 'python-13-turtle') setTurtleOutput(result.output)

      if (result.hasError && result.error) {
        const line =
          result.errorLine ?? extractErrorLine(result.error)
        const explained = explainPythonError(result.error, source, { errorLine: line })
        crash(explained.systemMessage, result.error, explained.line ?? line)
        applyChecks(source, result.output, true)
        if (opts?.narrateOnOk === undefined && mode === 'demo') {
          /* narrate handled by caller for bad demos */
        }
        return
      }

      setCaption('مینی گفت.')
      applyChecks(source, result.output, false)
      if (opts?.narrateOnOk) {
        onNarrate?.(opts.narrateOnOk)
        setCaption(opts.narrateOnOk)
      }
    },
    [
      applyChecks,
      askMiniInput,
      clearCrash,
      crash,
      lessonProfile,
      mode,
      onNarrate,
      runCode,
      runCodeSequential,
      useSequential,
    ]
  )

  async function runDemo(snippet: DemoSnippet) {
    setDemoCode(snippet.code)
    const isCrashDemo = snippet.id === 'bad'
    await execute(snippet.code, {
      trackTyped: false,
      narrateOnOk: isCrashDemo ? undefined : snippet.narrate,
    })
    if (isCrashDemo && snippet.narrate) {
      onNarrate?.(snippet.narrate)
    }
  }

  const showChecklist = mode === 'interactive'
  const editorValue = mode === 'demo' ? demoCode : code
  const editorReadOnly = mode === 'demo' || isBusy

  const editorDisplay = useMemo(() => {
    if (!errorLine) return editorValue
    return editorValue
  }, [editorValue, errorLine])

  return (
    <div className="rounded-2xl border border-teal-200 bg-white/95 p-4 shadow-sm md:p-5" dir="rtl">
      {mission ? (
        <p className="mb-3 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-center text-sm font-extrabold text-teal-900">
          {mission}
        </p>
      ) : null}

      {showRangeTip ? (
        <aside
          className="mb-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-bold text-sky-950"
          role="note"
        >
          {RANGE_ZERO_TIP}
        </aside>
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
                {ok ? '✓' : '○'} {g.label}
              </li>
            )
          })}
        </ul>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-extrabold text-slate-800">صحنهٔ مینی</h3>
        <p className="text-xs font-bold text-teal-800" aria-live="polite">
          {status === 'loading'
            ? 'مینی داره بیدار می‌شه...'
            : loadError
              ? 'محیط کد لود نشد'
              : caption}
        </p>
      </div>

      <div className="relative mb-4">
        <MiniSpeakStage lines={spokenLines} locked={locked} shaking={shaking} />
        {lessonProfile === 'python-13-turtle' ? <TurtleCanvas output={turtleOutput} /> : null}
        {crashMessage ? (
          <BrokenShowOverlay
            message={
              errorLine
                ? `${crashMessage} — خط ${errorLine}`
                : crashMessage
            }
            retryLabel="دوباره امتحان کن"
            onRetry={clearCrash}
          />
        ) : null}
      </div>

      {mode === 'demo' ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {demos.map((snippet) => (
            <button
              key={snippet.id}
              type="button"
              disabled={isBusy}
              onClick={() => void runDemo(snippet)}
              className={[
                'rounded-xl px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50',
                snippet.id === 'bad' ? 'bg-orange-500' : 'bg-teal-600',
              ].join(' ')}
            >
              {snippet.label}
            </button>
          ))}
        </div>
      ) : null}

      <label className="mb-1 block text-xs font-extrabold text-slate-600" htmlFor="py-editor">
        کد (پایتون)
        {errorLine ? (
          <span className="mr-2 font-bold text-rose-600">· قفل روی خط {errorLine}</span>
        ) : null}
      </label>
      <div className="relative">
        <textarea
          id="py-editor"
          dir="ltr"
          spellCheck={false}
          readOnly={editorReadOnly}
          value={editorDisplay}
          onChange={(e) => {
            if (mode === 'interactive') {
              setCode(e.target.value)
              if (e.target.value.trim()) {
                setDone((prev) => ({ ...prev, typed: true }))
              }
            }
          }}
          placeholder={
            lessonProfile === 'python-03-variables'
              ? 'name = "..."\nage = 10\nprint("سلام،", name, "- سن:", age)'
              : lessonProfile === 'python-04-numbers'
                ? 'print(2000 + 1500)'
                : lessonProfile === 'python-05-input'
                  ? 'name = input("اسمت چیه؟ ")\nprint("سلام " + name + "!")'
                  : lessonProfile === 'python-06-conditions'
                    ? 'answer = input("پایتخت ایران؟ ")\nif answer == "تهران":\n    print("آفرین!")\nelse:\n    print("دوباره تلاش کن!")'
                    : lessonProfile === 'python-07-for-loop'
                      ? 'for i in range(5):\n    print("*" * (i + 1))'
                      : lessonProfile === 'python-08-while-loop'
                        ? 'secret = 7\nguess = int(input("حدس بزن: "))\nwhile guess != secret:\n    print("اشتباه!")\n    guess = int(input("دوباره: "))\nprint("درست حدس زدی!")'
                        : lessonProfile === 'python-09-lists'
                          ? 'friends = ["آرش", "سارا"]\nfriends.append("مهراد")\nfor name in friends:\n    print(name)'
                          : lessonProfile === 'python-10-dicts'
                            ? 'player = {"name": "آرش", "age": 10}\nprint(player["name"])'
                            : lessonProfile === 'python-11-functions'
                              ? 'def greet(name):\n    print("سلام " + name)\n\ngreet("آرش")'
                              : lessonProfile === 'python-12-mini-project'
                                ? initialCode || 'print("1. جمع")\n# تابع و حلقه اضافه کن...'
                                : lessonProfile === 'python-13-turtle'
                                  ? 'import turtle\nt = turtle.Turtle()\nfor _ in range(4):\n    t.forward(80)\n    t.right(90)'
                                  : lessonProfile === 'python-14-capstone'
                                    ? '# پروژهٔ من\n# تابع + لیست یا dict\n'
                                    : 'print("...")'
          }
          className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-sm leading-6 text-sky-100 outline-none ring-teal-500 focus:ring-2 disabled:opacity-70"
          aria-label="ویرایشگر کد پایتون"
          style={
            errorLine
              ? {
                  backgroundImage: `linear-gradient(transparent ${(errorLine - 1) * 1.5}rem, rgba(244,63,94,0.25) ${(errorLine - 1) * 1.5}rem, rgba(244,63,94,0.25) ${errorLine * 1.5}rem, transparent ${errorLine * 1.5}rem)`,
                }
              : undefined
          }
        />
      </div>

      {mode === 'interactive' ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void execute(code)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
          >
            <Play className="h-4 w-4" aria-hidden />
            اجرا کن
          </button>
          <button
            type="button"
            onClick={() => {
              clearCrash()
              setSpokenLines([])
              setCode('')
              setDone({})
              setLastSuccessfulCode(undefined)
              setCaption(mission ?? '')
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            از نو
          </button>
        </div>
      ) : null}

      {band === 'B' && rawError ? (
        <details className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm">
          <summary className="cursor-pointer font-bold text-amber-900">متن خام خطا (اختیاری)</summary>
          <pre
            className="mt-2 overflow-x-auto whitespace-pre-wrap text-left text-xs text-amber-950"
            dir="ltr"
          >
            {rawError}
          </pre>
        </details>
      ) : null}

      {loadError ? (
        <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">
          {loadError}
        </p>
      ) : null}

      {inputPrompt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mini-input-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-teal-200 bg-white p-5 shadow-xl" dir="rtl">
            <p id="mini-input-title" className="text-sm font-extrabold text-teal-900">
              مینی داره ازت می‌پرسه
            </p>
            <p className="mt-2 text-base font-bold text-slate-800">{inputPrompt}</p>
            <input
              ref={inputFieldRef}
              type="text"
              value={inputDraft}
              onChange={(e) => setInputDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') finishInput(inputDraft)
                if (e.key === 'Escape') finishInput(null)
              }}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none ring-teal-500 focus:ring-2"
              aria-label={inputPrompt}
              dir="auto"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => finishInput(inputDraft)}
                className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white"
              >
                جواب بده
              </button>
              <button
                type="button"
                onClick={() => finishInput(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
