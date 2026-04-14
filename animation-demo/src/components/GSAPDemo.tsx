import { useRef, useCallback, useState } from 'react'
import gsap from 'gsap'

const BLOCK_COLORS = [
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-fuchsia-600',
]

export default function GSAPDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  const playTimeline = useCallback(() => {
    if (!containerRef.current) return

    if (tlRef.current) {
      tlRef.current.kill()
    }

    const blocks = containerRef.current.querySelectorAll('.gsap-block')
    const title = containerRef.current.querySelector('.gsap-title')
    const subtitle = containerRef.current.querySelector('.gsap-subtitle')

    gsap.set([blocks, title, subtitle], { clearProps: 'all' })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setHasPlayed(true),
    })

    tl.from(title, { y: -40, opacity: 0, duration: 0.6 })
      .from(subtitle, { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from(blocks, {
        y: 80,
        opacity: 0,
        scale: 0.8,
        rotation: -10,
        stagger: { amount: 0.6, from: 'start' },
        duration: 0.7,
      }, '-=0.2')
      .to(blocks, {
        scale: 1.05,
        stagger: { amount: 0.3, from: 'center' },
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      })

    tlRef.current = tl
    setHasPlayed(false)
  }, [])

  const reverseTimeline = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.reverse()
      setHasPlayed(false)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">点击播放 GSAP Timeline 编排动画</p>

      <div className="flex gap-3">
        <button
          onClick={playTimeline}
          className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-5 py-2 font-mono text-sm text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95"
        >
          ▶ Play Timeline
        </button>
        <button
          onClick={reverseTimeline}
          disabled={!hasPlayed}
          className="rounded-lg border border-gray-600 bg-gray-800/50 px-5 py-2 font-mono text-sm text-gray-400 transition-all hover:bg-gray-700/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ◀ Reverse
        </button>
      </div>

      <div ref={containerRef} className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 p-8">
        <h3 className="gsap-title mb-1 text-center text-xl font-semibold text-white">
          Timeline 编排演示
        </h3>
        <p className="gsap-subtitle mb-6 text-center text-sm text-gray-500">
          gsap.timeline() · stagger · ease
        </p>
        <div className="grid grid-cols-3 gap-4">
          {BLOCK_COLORS.map((color, i) => (
            <div
              key={i}
              className={`gsap-block h-20 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
            >
              <span className="font-mono text-sm font-semibold text-white/90">
                Block {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['timeline()', 'stagger', 'from()', 'yoyo'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 font-mono text-xs text-emerald-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
