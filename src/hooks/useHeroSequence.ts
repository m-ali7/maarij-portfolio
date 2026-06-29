import { useState, useEffect, useCallback, useRef } from 'react'

type SequencePhase =
  | 'idle'
  | 'cursor-blink'
  | 'greeting'
  | 'greeting-pause'
  | 'name'
  | 'name-pause'
  | 'titles-type'
  | 'titles-hold'
  | 'titles-delete'
  | 'titles-pause'
  | 'complete'

export interface SequenceState {
  phase: SequencePhase
  greetingText: string
  nameText: string
  currentTitle: string
  showCursor: boolean
  taglineVisible: boolean
  titlesStarted: boolean
}

const TITLES = [
  'Business Analyst',
  'AI Engineer',
  'Software Engineer',
  'Full Stack Developer',
]

const GREETING = 'Hi, my name is'
const NAME = 'Maarij Ali'

const TYPE_SPEED_GREETING = 50
const TYPE_SPEED_NAME = 65
const TYPE_SPEED_TITLE = 45
const DELETE_SPEED_TITLE = 22
const PAUSE_GREETING = 400
const PAUSE_NAME = 600
const TITLE_HOLD = 2200
const TITLE_PAUSE = 250
const CURSOR_BLINK_DURATION = 700

export function useHeroSequence() {
  const [state, setState] = useState<SequenceState>({
    phase: 'cursor-blink',
    greetingText: '',
    nameText: '',
    currentTitle: '',
    showCursor: true,
    taglineVisible: false,
    titlesStarted: false,
  })

  const cancelledRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const delay = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(resolve, ms)
      }),
    [],
  )

  useEffect(() => {
    cancelledRef.current = false

    const type = async (
      target: string,
      speed: number,
      setter: (t: string) => void,
    ) => {
      for (let i = 1; i <= target.length; i++) {
        if (cancelledRef.current) return
        setter(target.slice(0, i))
        await delay(speed)
      }
    }

    const erase = async (
      text: string,
      speed: number,
      setter: (t: string) => void,
    ) => {
      for (let i = text.length - 1; i >= 0; i--) {
        if (cancelledRef.current) return
        setter(text.slice(0, i))
        await delay(speed)
      }
    }

    const run = async () => {
      // 1. Cursor blink
      setState((s) => ({ ...s, phase: 'cursor-blink' }))
      await delay(CURSOR_BLINK_DURATION)
      if (cancelledRef.current) return

      // 2. Type greeting
      setState((s) => ({ ...s, phase: 'greeting' }))
      await type(GREETING, TYPE_SPEED_GREETING, (t) => {
        setState((s) => ({ ...s, greetingText: t }))
      })
      if (cancelledRef.current) return
      setState((s) => ({ ...s, phase: 'greeting-pause' }))
      await delay(PAUSE_GREETING)
      if (cancelledRef.current) return

      // 3. Type name
      setState((s) => ({ ...s, phase: 'name' }))
      await type(NAME, TYPE_SPEED_NAME, (t) => {
        setState((s) => ({ ...s, nameText: t }))
      })
      if (cancelledRef.current) return
      setState((s) => ({
        ...s,
        phase: 'name-pause',
        nameText: NAME,
        taglineVisible: true,
      }))
      await delay(PAUSE_NAME)
      if (cancelledRef.current) return

      // 4. Cycle all titles
      for (let idx = 0; idx < TITLES.length; idx++) {
        setState((s) => ({
          ...s,
          phase: 'titles-type',
          titlesStarted: true,
        }))
        let current = ''
        await type(TITLES[idx], TYPE_SPEED_TITLE, (t) => {
          current = t
          setState((s) => ({ ...s, currentTitle: t }))
        })
        if (cancelledRef.current) return
        setState((s) => ({ ...s, phase: 'titles-hold' }))
        await delay(TITLE_HOLD)
        if (cancelledRef.current) return
        if (idx >= TITLES.length - 1) break
        setState((s) => ({ ...s, phase: 'titles-delete' }))
        await erase(current, DELETE_SPEED_TITLE, (t) => {
          setState((s) => ({ ...s, currentTitle: t }))
        })
        if (cancelledRef.current) return
        setState((s) => ({ ...s, phase: 'titles-pause' }))
        await delay(TITLE_PAUSE)
        if (cancelledRef.current) return
      }

      setState((s) => ({
        ...s,
        phase: 'complete',
        currentTitle: '',
        showCursor: false,
      }))
    }

    run()

    return () => {
      cancelledRef.current = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [delay])

  return state
}

export { TITLES }
