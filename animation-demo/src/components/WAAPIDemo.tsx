import { useRef, useCallback } from 'react'

const COLORS = ['#f472b6', '#818cf8', '#34d399', '#fbbf24', '#60a5fa', '#fb923c', '#a78bfa', '#f87171']

export default function WAAPIDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  const spawnParticles = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const count = 20 + Math.floor(Math.random() * 15)

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      const size = 4 + Math.random() * 8
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const velocity = 60 + Math.random() * 120
      const dx = Math.cos(angle) * velocity
      const dy = Math.sin(angle) * velocity

      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: ${Math.random() > 0.3 ? '50%' : '2px'};
        background: ${color};
        pointer-events: none;
        box-shadow: 0 0 6px ${color}80;
      `
      container.appendChild(particle)

      const animation = particle.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 },
        ],
        {
          duration: 600 + Math.random() * 500,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )

      animation.onfinish = () => particle.remove()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">点击下方区域生成粒子爆炸效果</p>

      <div
        ref={containerRef}
        onClick={spawnParticles}
        className="relative h-64 w-full cursor-crosshair overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/80 transition-colors hover:border-indigo-500/40"
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-4xl">💥</div>
            <span className="font-mono text-xs text-gray-500">Click anywhere</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['Element.animate()', '.finished', 'playbackRate', 'fill: forwards'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 font-mono text-xs text-indigo-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
