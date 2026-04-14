import { useEffect, useRef, useState } from 'react'
import lottie, { type AnimationItem } from 'lottie-web'

const LOTTIE_URL = 'https://assets2.lottiefiles.com/packages/lf20_khzniaya.json'

export default function LottieDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: LOTTIE_URL,
    })

    anim.addEventListener('DOMLoaded', () => setLoaded(true))
    animRef.current = anim

    return () => {
      anim.destroy()
      animRef.current = null
    }
  }, [])

  const togglePlay = () => {
    if (!animRef.current) return
    if (isPlaying) {
      animRef.current.pause()
    } else {
      animRef.current.play()
    }
    setIsPlaying((p) => !p)
  }

  const changeSpeed = (s: number) => {
    setSpeed(s)
    animRef.current?.setSpeed(s)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">Lottie 矢量动画 — 支持播放控制</p>

      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-gray-700 bg-gray-900/80">
        {!loaded && (
          <div className="absolute flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-purple-500" />
            <span className="font-mono text-xs text-gray-500">加载动画资源...</span>
          </div>
        )}
        <div
          ref={containerRef}
          className={`h-56 w-56 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="rounded-lg border border-purple-500/50 bg-purple-500/10 px-4 py-2 font-mono text-sm text-purple-400 transition-all hover:bg-purple-500/20 active:scale-95"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <div className="flex overflow-hidden rounded-lg border border-gray-700">
          {[0.5, 1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => changeSpeed(s)}
              className={`px-3 py-2 font-mono text-xs transition-colors ${
                speed === s
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['Bodymovin', 'JSON export', 'lottie-web', 'setSpeed()'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 font-mono text-xs text-purple-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
