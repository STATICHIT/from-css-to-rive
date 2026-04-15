import { useRef, useEffect, useCallback } from 'react'

const RADIUS = 160
const TRAIL_COUNT = 6

interface Point { x: number; y: number }

export const CLIPPATH_CODE = `// 分工：WAAPI 负责入场/退场过渡，rAF 负责实时轨迹追踪

// ── 入场：WAAPI 圆形生长动画 ──────────────────────────────────
const anim = layer.animate(
  [{ clipPath: \`circle(0px at \${x}px \${y}px)\` },
   { clipPath: \`circle(140px at \${x}px \${y}px)\` }],
  { duration: 350, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
);
anim.onfinish = () => {
  anim.commitStyles(); // 将终态写入 inline style，WAAPI 退出舞台
  anim.cancel();
  startRafTracking();  // 交由 rAF 接管
};

// ── 追踪阶段：6 个轨迹点 + 递减阻尼 ─────────────────────────
const trail = Array(6).fill(0).map(() => ({ x: 0, y: 0 }));

function trackLoop() {
  for (let i = 0; i < 6; i++) {
    const prev  = i === 0 ? mouse : trail[i - 1];
    const damp  = 0.7 - i * 0.04;   // 头快尾慢
    trail[i].x += (prev.x - trail[i].x) * damp;
    trail[i].y += (prev.y - trail[i].y) * damp;
  }
  const [head, tail] = [trail[0], trail[5]];
  const dist = Math.hypot(head.x - tail.x, head.y - tail.y);

  // 静止 → 圆；快速移动 → 拉伸椭圆 polygon
  layer.style.clipPath = dist < 10
    ? \`circle(140px at \${head.x}px \${head.y}px)\`
    : buildEllipsePolygon(head, tail, 140);

  requestAnimationFrame(trackLoop);
}

// ── 退场：WAAPI 圆形收缩动画 ─────────────────────────────────
const leaveAnim = layer.animate(
  [{ clipPath: currentClip }, { clipPath: \`circle(0px at \${head.x}px \${head.y}px)\` }],
  { duration: 400, easing: 'ease-in' }
);
leaveAnim.onfinish = () => {
  leaveAnim.commitStyles();
  leaveAnim.cancel();
};`

export default function ClipPathTrailDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const layer2Ref = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef(0)
  const animRef = useRef<Animation | null>(null)
  const targetRef = useRef<Point>({ x: 0, y: 0 })
  const trailRef = useRef<Point[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))
  )

  const buildEllipsePolygon = (head: Point, tail: Point, r: number): string => {
    const angle = Math.atan2(tail.y - head.y, tail.x - head.x)
    const pts: string[] = []
    for (let i = 0; i <= 30; i++) {
      const a = angle - Math.PI / 2 + (Math.PI * i) / 30
      pts.push(`${head.x + r * Math.cos(a)}px ${head.y + r * Math.sin(a)}px`)
    }
    for (let i = 0; i <= 30; i++) {
      const a = angle + Math.PI / 2 + (Math.PI * i) / 30
      pts.push(`${tail.x + r * Math.cos(a)}px ${tail.y + r * Math.sin(a)}px`)
    }
    return `polygon(${pts.join(', ')})`
  }

  const stopRaf = () => {
    cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = 0
  }

  const trackLoop = useCallback(() => {
    const layer = layer2Ref.current
    if (!layer) return
    const trail = trailRef.current
    const target = targetRef.current

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const prev = i === 0 ? target : trail[i - 1]
      const d = 0.7 - i * 0.04
      trail[i].x += (prev.x - trail[i].x) * d
      trail[i].y += (prev.y - trail[i].y) * d
    }

    const head = trail[0]
    const tail = trail[TRAIL_COUNT - 1]
    const dist = Math.hypot(head.x - tail.x, head.y - tail.y)

    layer.style.clipPath = dist < 10
      ? `circle(${RADIUS}px at ${head.x}px ${head.y}px)`
      : buildEllipsePolygon(head, tail, RADIUS)

    rafIdRef.current = requestAnimationFrame(trackLoop)
  }, [])

  const onMouseEnter = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current!
    const layer = layer2Ref.current!
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 取消上一个动画（如快速移入移出的情况）
    if (animRef.current) { animRef.current.cancel(); animRef.current = null }
    stopRaf()

    trailRef.current.forEach((p) => { p.x = x; p.y = y })
    targetRef.current = { x, y }

    // WAAPI：圆形生长入场
    const anim = layer.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${RADIUS}px at ${x}px ${y}px)` },
      ],
      { duration: 350, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    )
    animRef.current = anim

    anim.onfinish = () => {
      // commitStyles 将终态写入 inline style，然后 cancel 移除 WAAPI 效果
      anim.commitStyles()
      anim.cancel()
      animRef.current = null
      // 交由 rAF 接管 clip-path 更新
      rafIdRef.current = requestAnimationFrame(trackLoop)
    }
  }, [trackLoop])

  const onMouseLeave = useCallback(() => {
    stopRaf()
    const layer = layer2Ref.current!

    // 若入场动画还未完成，直接隐藏
    if (animRef.current) {
      animRef.current.cancel()
      animRef.current = null
      layer.style.clipPath = 'circle(0px at -300px -300px)'
      return
    }

    // WAAPI：圆形收缩退场
    const head = trailRef.current[0]
    const fromClip = `circle(${RADIUS}px at ${head.x}px ${head.y}px)`
    layer.style.clipPath = fromClip

    const anim = layer.animate(
      [{ clipPath: fromClip }, { clipPath: `circle(0px at ${head.x}px ${head.y}px)` }],
      { duration: 400, easing: 'ease-in' }
    )
    animRef.current = anim

    anim.onfinish = () => {
      if (animRef.current !== anim) return
      anim.commitStyles()
      anim.cancel()
      animRef.current = null
      layer.style.clipPath = 'circle(0px at -300px -300px)'
    }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!rafIdRef.current) return
    const rect = containerRef.current!.getBoundingClientRect()
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  useEffect(() => () => { stopRaf(); animRef.current?.cancel() }, [])

  const ROWS = 8
  const COLS = 7

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">移入区域，快速移动鼠标查看拖尾拉伸效果</p>
      <a
        href="https://mimo.xiaomi.com/zh/index"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-gray-700/60 bg-gray-800/40 px-3 py-1 font-mono text-xs text-gray-500 transition-all hover:border-gray-500 hover:text-gray-300"
      >
        <span className="text-gray-600">参考</span>
        <span className="text-gray-400">↗</span>
        小米 MIMO 首页
      </a>
      <div
        ref={containerRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        className="relative h-80 w-full cursor-crosshair overflow-hidden rounded-2xl select-none"
        style={{ background: '#04090f', border: '1px solid #0a1e35' }}
      >
        {/* Layer 1：基础层 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: ROWS }).map((_, r) => (
            <div
              key={r}
              className="flex whitespace-nowrap font-black"
              style={{
                marginLeft: r % 2 ? '-4rem' : '0',
                fontSize: 44,
                lineHeight: 1.5,
                letterSpacing: '0.25em',
                color: '#091524',
              }}
            >
              {Array.from({ length: COLS }).map((_, c) => (
                <span key={c} className="mr-10">ZHIHU</span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            style={{
              fontFamily: "'Nunito', 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', sans-serif",
              fontSize: '3rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: 'rgba(214,230,255,0.88)',
            }}
          >
            你好，知乎
          </span>
        </div>

        {/* Layer 2：揭示层（clip-path 控制显示区域） */}
        <div
          ref={layer2Ref}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            background: '#020c1e',
            clipPath: 'circle(0px at -300px -300px)',
            willChange: 'clip-path',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: ROWS }).map((_, r) => (
              <div
                key={r}
                className="flex whitespace-nowrap font-black"
                style={{
                  marginLeft: r % 2 ? '-4rem' : '0',
                  fontSize: 44,
                  lineHeight: 1.5,
                  letterSpacing: '0.25em',
                  color: '#00244d',
                }}
              >
                {Array.from({ length: COLS }).map((_, c) => (
                  <span key={c} className="mr-10">ZHIHU</span>
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              style={{
                fontFamily: "'Nunito', 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', sans-serif",
                fontSize: '3rem',
                fontWeight: 900,
                letterSpacing: '0.18em',
                color: '#0084FF',
              }}
            >
              Hello,ZHIHU
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['commitStyles()', 'clip-path morph', 'trail damping', 'rAF handoff'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-blue-900/60 bg-blue-950/40 px-3 py-1 font-mono text-xs text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
