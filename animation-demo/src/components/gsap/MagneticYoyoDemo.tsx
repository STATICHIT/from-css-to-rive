import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const ROWS = 12
const COLS = 18
const BALL_RADIUS = 16
const MOUSE_RADIUS = 140

interface Ball {
  el: SVGCircleElement
  lineEl: SVGLineElement
  oriX: number
  oriY: number
  animater: gsap.core.Timeline | null
}

export const MAGNETIC_CODE = `// 每个小球记录原点坐标和当前动画实例
const balls = createGrid(ROWS, COLS); // SVG circle 元素数组

svg.addEventListener('mousemove', (e) => {
  const { left, top } = svg.getBoundingClientRect();
  const mouseX = e.clientX - left;
  const mouseY = e.clientY - top;

  balls.forEach((ball) => {
    const dx = ball.oriX - mouseX;
    const dy = ball.oriY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= MOUSE_RADIUS) {
      // 计算排斥点：鼠标位置 + 单位向量 × 排斥半径
      const moveX = mouseX + (dx / distance) * MOUSE_RADIUS;
      const moveY = mouseY + (dy / distance) * MOUSE_RADIUS;

      if (ball.animater) ball.animater.kill();
      ball.animater = gsap.timeline()
        // 快速移至排斥点
        .to(ball.el,   { attr: { cx: moveX, cy: moveY },
            duration: 0.5, ease: 'power3.out' })
        // 同步拉伸连线
        .to(ball.line, { attr: { x2: moveX, y2: moveY },
            duration: 0.5, ease: 'power3.out' }, '<')
        // 弹性回弹至原点
        .to(ball.el,   { attr: { cx: ball.oriX, cy: ball.oriY },
            duration: 1, ease: 'elastic.out(1, 0.4)' }, '<0.1')
        .to(ball.line, { attr: { x2: ball.oriX, y2: ball.oriY },
            duration: 1, ease: 'elastic.out(1, 0.4)' }, '<');
    }
  });
});`

export default function MagneticYoyoDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const ballsRef = useRef<Ball[]>([])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    while (svg.firstChild) svg.removeChild(svg.firstChild)
    ballsRef.current = []

    const { width, height } = svg.getBoundingClientRect()

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const x = (width / COLS) * c
        const y = (height / ROWS) * r

        const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        lineEl.setAttribute('x1', String(x))
        lineEl.setAttribute('y1', String(y))
        lineEl.setAttribute('x2', String(x))
        lineEl.setAttribute('y2', String(y))
        lineEl.setAttribute('stroke', '#4ade80')
        lineEl.setAttribute('stroke-width', '1.5')
        lineEl.setAttribute('stroke-opacity', '0.4')
        svg.appendChild(lineEl)

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        dot.setAttribute('cx', String(x))
        dot.setAttribute('cy', String(y))
        dot.setAttribute('r', String(BALL_RADIUS / 4))
        dot.setAttribute('fill', '#f7f7f7')
        dot.setAttribute('opacity', '0.4')
        svg.appendChild(dot)

        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        el.setAttribute('cx', String(x))
        el.setAttribute('cy', String(y))
        el.setAttribute('r', String(BALL_RADIUS))
        el.setAttribute('fill', '#4ade80')
        el.setAttribute('fill-opacity', '0.85')
        svg.appendChild(el)

        ballsRef.current.push({ el, lineEl, oriX: x, oriY: y, animater: null })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      ballsRef.current.forEach((ball) => {
        const dx = ball.oriX - mouseX
        const dy = ball.oriY - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= MOUSE_RADIUS) {
          const moveX = mouseX + (dx / distance) * MOUSE_RADIUS
          const moveY = mouseY + (dy / distance) * MOUSE_RADIUS

          if (ball.animater) ball.animater.kill()
          ball.animater = gsap.timeline()
            .to(ball.el, {
              attr: { cx: moveX, cy: moveY },
              duration: 0.5, ease: 'power3.out',
            })
            .to(ball.lineEl, {
              attr: { x2: moveX, y2: moveY },
              duration: 0.5, ease: 'power3.out',
            }, '<')
            .to(ball.el, {
              attr: { cx: ball.oriX, cy: ball.oriY },
              duration: 1, ease: 'elastic.out(1, 0.4)',
            }, '<0.1')
            .to(ball.lineEl, {
              attr: { x2: ball.oriX, y2: ball.oriY },
              duration: 1, ease: 'elastic.out(1, 0.4)',
            }, '<')
        }
      })
    }

    svg.addEventListener('mousemove', handleMouseMove)
    return () => {
      svg.removeEventListener('mousemove', handleMouseMove)
      ballsRef.current.forEach((b) => b.animater?.kill())
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">移动鼠标到网格上，小球会产生磁力排斥并弹回</p>

      <div className="w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/80">
        <svg
          ref={svgRef}
          className="h-96 w-full cursor-crosshair"
          style={{ display: 'block' }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['gsap.timeline()', 'attr tween', 'elastic.out', 'SVG animate'].map((tag) => (
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
