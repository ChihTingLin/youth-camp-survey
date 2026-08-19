import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { useSurvey } from './app/surveyContext'
import { SurveyShell } from './components/layout/SurveyShell'
import { ProfileSetup } from './components/questions/ProfileSetup'
import { QuestionInteraction } from './components/questions/QuestionInteraction'
import { SubmissionStatus } from './components/questions/SubmissionStatus'
import { QUESTIONS } from './data/questions'

function App() {
  const { state, submission } = useSurvey()
  const reduceMotion = useReducedMotion()
  const previousScreen = useRef(state.screen)
  const screenContent = useRef<HTMLElement>(null)
  const focusPending = useRef(false)
  const question = QUESTIONS.find(({ id }) => id === state.screen)
  const direction = state.navigationDirection

  useLayoutEffect(() => {
    if (previousScreen.current !== state.screen) {
      previousScreen.current = state.screen
      focusPending.current = true
    }
  }, [state.screen])

  const content =
    state.screen === 'profile'
      ? {
          eyebrow: '在出發之前，',
          title: '如果願意，和我們簡單打聲招呼',
          description: '組別與性別請選擇一項；姓名可以自由選擇是否留下。',
        }
      : state.screen === 'complete'
        ? getCompletionContent(submission.status)
        : question
  const title = getScreenTitle(state.screen, content?.title)
  const description = getScreenDescription(state.screen, content?.description)

  return (
    <SurveyShell>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.section
          key={state.screen}
          ref={screenContent}
          data-screen={state.screen}
          className="survey-screen w-full max-w-5xl scroll-mt-24 outline-none"
          tabIndex={-1}
          aria-labelledby="screen-title"
          custom={direction}
          variants={{
            enter: (travelDirection: number) => ({
              opacity: reduceMotion ? 1 : 0,
              x: reduceMotion ? 0 : travelDirection * 28,
            }),
            center: { opacity: 1, x: 0 },
            exit: (travelDirection: number) => ({
              opacity: reduceMotion ? 1 : 0,
              x: reduceMotion ? 0 : travelDirection * -18,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0 : 0.26 }}
          onAnimationComplete={(definition) => {
            if (definition !== 'center' || !focusPending.current) return
            screenContent.current?.focus({ preventScroll: true })
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? 'auto' : 'smooth',
            })
            focusPending.current = false
          }}
        >
          <p className="survey-eyebrow text-lg font-medium tracking-[0.12em] text-camp-forest sm:text-xl">
            {content?.eyebrow}
          </p>
          <h1
            id="screen-title"
            className="survey-title mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-[0.015em] text-balance text-camp-ink sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          {description ? (
            <p className="survey-description mt-5 max-w-2xl text-base leading-7 tracking-[0.06em] text-camp-ink/65 sm:text-lg">
              {description}
            </p>
          ) : null}

          {state.screen === 'profile' ? (
            <ProfileSetup />
          ) : state.screen === 'complete' ? (
            <SubmissionStatus />
          ) : (
            <QuestionInteraction />
          )}
        </motion.section>
      </AnimatePresence>
    </SurveyShell>
  )
}

function getCompletionContent(status: string) {
  if (status === 'failed') {
    return {
      eyebrow: '旅途中遇到一點阻礙，',
      title: '你的答案還安全留在這裡',
      description: '尚未收到送達確認，請檢查連線後再試一次。',
    }
  }

  if (status === 'succeeded') {
    return {
      eyebrow: '謝謝你的真實分享，',
      title: '你已經走完這段覺察旅程',
      description: '你的回答已成功送出，我們營隊見。',
    }
  }

  return {
    eyebrow: '最後一步，',
    title: '正在將你的分享送回營地',
    description: '完成送達確認後，就可以放心關閉這個頁面。',
  }
}

function getScreenTitle(screen: string, fallback?: string): ReactNode {
  switch (screen) {
    case 'profile':
      return (
        <>
          如果願意，<br className="sm:hidden" />
          和我們簡單打聲招呼
        </>
      )
    case 'psychologicalEnergy':
      return (
        <>
          <span className="sm:hidden">
            您的<span className="text-camp-forest">心理</span>能量水平？
            <span className="mt-1 block">（1–10 分）</span>
          </span>
          <span className="hidden sm:inline">
            您的<span className="text-camp-forest">心理</span>能量水平（1–10 分）？
          </span>
        </>
      )
    case 'bodySignals':
      return <>整體最明顯的<span className="text-camp-forest">身體狀態</span>是？</>
    case 'campExpectation':
      return <>獲得什麼<span className="text-camp-forest">幫助或調整</span>？</>
    default:
      return fallback
  }
}

function getScreenDescription(screen: string, fallback?: string): ReactNode {
  if (screen === 'psychologicalEnergy') {
    return null
  }

  if (screen === 'campExpectation') {
    return (
      <>
        可以是方向、想法、行動力、與自己和解，也可以是好好休息、認識不同的人……
        <span className="mt-1 block">這題可以留白；有想法時，再寫下此刻最真實的期待。</span>
      </>
    )
  }

  return fallback
}

export default App
