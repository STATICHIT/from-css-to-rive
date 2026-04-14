import { useState } from 'react'

export default function CSSAnimationDemo() {
  const [liked, setLiked] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleClick = () => {
    setLiked((prev) => !prev)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 800)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-sm text-gray-400">点击心形按钮触发心跳动画</p>

      <button
        onClick={handleClick}
        className="group relative flex items-center gap-3 rounded-2xl border border-gray-700 bg-gray-800/50 px-8 py-4 transition-all duration-300 hover:border-pink-500/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-pink-500/10 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-8 w-8 transition-colors duration-300 ${liked ? 'fill-pink-500 text-pink-500' : 'fill-none text-gray-400 group-hover:text-pink-400'}`}
          stroke="currentColor"
          strokeWidth={2}
          style={{
            animation: animating ? 'heartbeat 0.8s ease-in-out' : 'none',
          }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="text-lg font-medium text-gray-200">
          {liked ? '已点赞' : '点赞'}
        </span>

        {animating && (
          <>
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-pink-400"
                style={{
                  animation: `particle-fly 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.05}s`,
                  '--angle': `${i * 60}deg`,
                } as React.CSSProperties}
              />
            ))}
          </>
        )}
      </button>

      <div className="flex gap-4">
        {['transition', 'keyframes', 'cubic-bezier'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 font-mono text-xs text-cyan-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.2); }
          60% { transform: scale(1); }
        }
        @keyframes particle-fly {
          0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-40px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
