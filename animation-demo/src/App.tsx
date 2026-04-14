import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import {
  Paintbrush,
  Sparkles,
  Clapperboard,
  Film,
  Gamepad2,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { chapters, type Chapter } from './data/content'
import CodeBlock from './components/CodeBlock'

const CSSAnimationDemo = lazy(() => import('./components/CSSAnimationDemo'))
const WAAPIDemo = lazy(() => import('./components/WAAPIDemo'))
const GSAPDemo = lazy(() => import('./components/GSAPDemo'))
const LottieDemo = lazy(() => import('./components/LottieDemo'))
const RiveDemo = lazy(() => import('./components/RiveDemo'))

const ICON_MAP: Record<string, React.ElementType> = {
  Paintbrush,
  Sparkles,
  Clapperboard,
  Film,
  Gamepad2,
}

const DEMO_MAP: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'css-animations': CSSAnimationDemo,
  waapi: WAAPIDemo,
  gsap: GSAPDemo,
  lottie: LottieDemo,
  rive: RiveDemo,
}

const ACCENT_MAP: Record<string, string> = {
  'css-animations': 'text-pink-400 border-pink-500/40 bg-pink-500/10',
  waapi: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
  gsap: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  lottie: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
  rive: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
}

function DemoFallback() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-600 border-t-gray-300" />
    </div>
  )
}

function ChapterContent({ chapter }: { chapter: Chapter }) {
  const DemoComponent = DEMO_MAP[chapter.id]
  const accent = ACCENT_MAP[chapter.id] ?? 'text-gray-400 border-gray-500/40 bg-gray-500/10'
  const accentColor = accent.split(' ')[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">{chapter.title}</h1>
        <p className={`font-mono text-sm ${accentColor}`}>{chapter.subtitle}</p>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6">
        <p className="leading-relaxed text-gray-300">{chapter.description}</p>
      </div>

      {/* Use cases & Pros/Cons */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Zap className="h-4 w-4 text-amber-400" />
            适用场景
          </h3>
          <ul className="space-y-2">
            {chapter.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" />
                {uc}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6">
          <h3 className="mb-4 font-semibold text-white">优势 & 局限</h3>
          <div className="space-y-3">
            {chapter.prosAndCons.pros.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-emerald-400/80">
                <span className="mt-0.5 shrink-0">✓</span> {p}
              </div>
            ))}
            {chapter.prosAndCons.cons.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-red-400/70">
                <span className="mt-0.5 shrink-0">✗</span> {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Example — skipped when the demo manages its own code (e.g. GSAP) */}
      {chapter.codeExample && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <span className="font-mono text-xs text-gray-500">{'</'}</span>
            代码示例
          </h3>
          <CodeBlock code={chapter.codeExample} language={chapter.codeLang} />
        </div>
      )}

      {/* Live Demo */}
      <div>
        <h3 className="mb-3 font-semibold text-white">
          🎯 交互演示
        </h3>
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/20 p-6">
          <Suspense fallback={<DemoFallback />}>
            {DemoComponent && <DemoComponent />}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState(chapters[0].id)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeId])

  const activeChapter = chapters.find((c) => c.id === activeId)!

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-800 bg-gray-950">
        {/* Logo */}
        <div className="border-b border-gray-800 p-6">
          <h1 className="text-lg font-bold text-white">
            Web 动画
            <span className="ml-1 text-gray-500">不完全指南</span>
          </h1>
          <p className="mt-1 font-mono text-xs text-gray-600">
            Animations Handbook
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {chapters.map((chapter, index) => {
              const Icon = ICON_MAP[chapter.icon]
              const isActive = chapter.id === activeId
              const accent = ACCENT_MAP[chapter.id] ?? ''
              const accentColor = accent.split(' ')[0]

              return (
                <button
                  key={chapter.id}
                  onClick={() => setActiveId(chapter.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? `border border-gray-700/50 bg-gray-800/80 ${accentColor}`
                      : 'border border-transparent text-gray-500 hover:bg-gray-800/40 hover:text-gray-300'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-mono ${
                      isActive ? accent : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className={`truncate text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                      {chapter.title}
                    </div>
                    <div className="truncate text-xs text-gray-600">
                      {chapter.subtitle}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-2 font-mono text-xs text-gray-600">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Powered by React + Vite</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-8 py-10">
          <ChapterContent chapter={activeChapter} />
        </div>
      </main>
    </div>
  )
}
