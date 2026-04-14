import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const ROWS = 10
const COLS = 14
const MOUSE_RADIUS = 140
const NS = 'http://www.w3.org/2000/svg'

// ── 6 种花型定义 ──────────────────────────────────────────────
interface FlowerDef {
  id: string
  petalCount: number
  rx: number
  ry: number
  offset: number          // 花瓣中心距花心
  initAngle: number       // 初始旋转偏移
  colors: string[]
  centerColor: string
  centerR: number
}

const FLOWER_DEFS: FlowerDef[] = [
  {
    // 四叶草型：4 片宽圆瓣
    id: 'f0', petalCount: 4, rx: 8, ry: 11, offset: 8, initAngle: 45,
    colors: ['#f87171', '#fbbf24', '#34d399', '#60a5fa'],
    centerColor: '#ffffff', centerR: 4.5,
  },
  {
    // 樱花型：5 片粉紫圆瓣
    id: 'f1', petalCount: 5, rx: 6, ry: 13, offset: 9, initAngle: 0,
    colors: ['#f9a8d4', '#f472b6', '#e879f9', '#c084fc', '#a78bfa'],
    centerColor: '#fef08a', centerR: 4,
  },
  {
    // 六瓣彩虹花
    id: 'f2', petalCount: 6, rx: 5, ry: 14, offset: 10, initAngle: 0,
    colors: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8'],
    centerColor: '#fbbf24', centerR: 5,
  },
  {
    // 雏菊型：8 片柔色宽瓣
    id: 'f3', petalCount: 8, rx: 4.5, ry: 11, offset: 8, initAngle: 22.5,
    colors: ['#fca5a5', '#fde68a', '#a7f3d0', '#bae6fd', '#ddd6fe', '#f5d0fe', '#fed7aa', '#fbcfe8'],
    centerColor: '#fef9c3', centerR: 4,
  },
  {
    // 十瓣彩虹爆炸花
    id: 'f4', petalCount: 10, rx: 3, ry: 12, offset: 9, initAngle: 0,
    colors: ['#c084fc', '#e879f9', '#f472b6', '#fb7185', '#f87171',
             '#fb923c', '#facc15', '#a3e635', '#34d399', '#22d3ee'],
    centerColor: '#fef08a', centerR: 4,
  },
  {
    // 菊花型：12 片细长花瓣
    id: 'f5', petalCount: 12, rx: 2.5, ry: 10, offset: 7.5, initAngle: 15,
    colors: ['#fca5a5', '#fed7aa', '#fef08a', '#d9f99d', '#a7f3d0',
             '#bae6fd', '#c7d2fe', '#ddd6fe', '#f5d0fe', '#fbcfe8', '#fecdd3', '#fff7ed'],
    centerColor: '#4ade80', centerR: 3.5,
  },
]

function buildFlowerGroup(def: FlowerDef): SVGGElement {
  const g = document.createElementNS(NS, 'g') as SVGGElement
  g.setAttribute('id', def.id)

  for (let i = 0; i < def.petalCount; i++) {
    const angle = def.initAngle + (360 / def.petalCount) * i
    const color = def.colors[i % def.colors.length]

    const petal = document.createElementNS(NS, 'ellipse')
    petal.setAttribute('rx', String(def.rx))
    petal.setAttribute('ry', String(def.ry))
    petal.setAttribute('fill', color)
    petal.setAttribute('fill-opacity', '0.93')
    petal.setAttribute('transform', `rotate(${angle}) translate(0,${-def.offset})`)
    g.appendChild(petal)

    // 每瓣高光
    const hl = document.createElementNS(NS, 'ellipse')
    hl.setAttribute('rx', String(def.rx * 0.38))
    hl.setAttribute('ry', String(def.ry * 0.32))
    hl.setAttribute('fill', 'white')
    hl.setAttribute('fill-opacity', '0.28')
    hl.setAttribute('transform',
      `rotate(${angle}) translate(${-def.rx * 0.22},${-def.offset - def.ry * 0.18})`)
    g.appendChild(hl)
  }

  // 花心
  const center = document.createElementNS(NS, 'circle')
  center.setAttribute('r', String(def.centerR))
  center.setAttribute('fill', def.centerColor)
  g.appendChild(center)

  // 花心高光
  const shine = document.createElementNS(NS, 'circle')
  shine.setAttribute('r', String(def.centerR * 0.4))
  shine.setAttribute('cx', String(-def.centerR * 0.3))
  shine.setAttribute('cy', String(-def.centerR * 0.3))
  shine.setAttribute('fill', 'white')
  shine.setAttribute('fill-opacity', '0.65')
  g.appendChild(shine)

  return g
}

// ── 组件 ──────────────────────────────────────────────────────
interface Flower {
  el: SVGUseElement
  lineEl: SVGLineElement
  oriX: number
  oriY: number
  animater: gsap.core.Timeline | null
}

export const MAGNETIC_CODE = `// 在 <defs> 中定义多种花型（每种花是一个 <g id="fN">）
FLOWER_DEFS.forEach(def => {
  const g = buildFlowerGroup(def); // 花瓣 + 花心居中于原点
  defs.appendChild(g);
});

// 每个网格点随机选一种花型
const typeId = FLOWER_DEFS[Math.floor(Math.random() * FLOWER_DEFS.length)].id;
const el = createSVGElement('use');
el.setAttribute('href', '#' + typeId);
el.setAttribute('x', String(oriX));  // x/y 即花心坐标
el.setAttribute('y', String(oriY));

// GSAP 动画：排斥 + 弹性回弹
gsap.timeline()
  .to(el,   { attr: { x: moveX, y: moveY }, duration: 0.5, ease: 'power3.out' })
  .to(line, { attr: { x2: moveX, y2: moveY }, duration: 0.5, ease: 'power3.out' }, '<')
  .to(el,   { attr: { x: oriX, y: oriY }, duration: 1.1, ease: 'elastic.out(1,0.4)' }, '<0.1')
  .to(line, { attr: { x2: oriX, y2: oriY }, duration: 1.1, ease: 'elastic.out(1,0.4)' }, '<');`

export default function MagneticYoyoDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const flowersRef = useRef<Flower[]>([])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    while (svg.firstChild) svg.removeChild(svg.firstChild)
    flowersRef.current = []

    const { width, height } = svg.getBoundingClientRect()

    // defs
    const defs = document.createElementNS(NS, 'defs')
    FLOWER_DEFS.forEach((def) => defs.appendChild(buildFlowerGroup(def)))
    svg.appendChild(defs)

    // grid
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const x = (width / COLS) * c
        const y = (height / ROWS) * r
        const def = FLOWER_DEFS[Math.floor(Math.random() * FLOWER_DEFS.length)]

        // 茎线
        const lineEl = document.createElementNS(NS, 'line') as SVGLineElement
        lineEl.setAttribute('x1', String(x))
        lineEl.setAttribute('y1', String(y))
        lineEl.setAttribute('x2', String(x))
        lineEl.setAttribute('y2', String(y))
        lineEl.setAttribute('stroke', '#94a3b8')
        lineEl.setAttribute('stroke-width', '1.2')
        lineEl.setAttribute('stroke-opacity', '0.25')
        svg.appendChild(lineEl)

        // 锚点
        const dot = document.createElementNS(NS, 'circle')
        dot.setAttribute('cx', String(x))
        dot.setAttribute('cy', String(y))
        dot.setAttribute('r', '1.8')
        dot.setAttribute('fill', '#cbd5e1')
        dot.setAttribute('opacity', '0.3')
        svg.appendChild(dot)

        // 花朵
        const el = document.createElementNS(NS, 'use') as SVGUseElement
        el.setAttribute('href', `#${def.id}`)
        el.setAttribute('x', String(x))
        el.setAttribute('y', String(y))
        svg.appendChild(el)

        flowersRef.current.push({ el, lineEl, oriX: x, oriY: y, animater: null })
      }
    }

    // mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      flowersRef.current.forEach((flower) => {
        const dx = flower.oriX - mouseX
        const dy = flower.oriY - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist <= MOUSE_RADIUS) {
          const moveX = mouseX + (dx / dist) * MOUSE_RADIUS
          const moveY = mouseY + (dy / dist) * MOUSE_RADIUS

          if (flower.animater) flower.animater.kill()
          flower.animater = gsap.timeline()
            .to(flower.el,     { attr: { x: moveX, y: moveY }, duration: 0.5, ease: 'power3.out' })
            .to(flower.lineEl, { attr: { x2: moveX, y2: moveY }, duration: 0.5, ease: 'power3.out' }, '<')
            .to(flower.el,     { attr: { x: flower.oriX, y: flower.oriY }, duration: 1.1, ease: 'elastic.out(1, 0.4)' }, '<0.1')
            .to(flower.lineEl, { attr: { x2: flower.oriX, y2: flower.oriY }, duration: 1.1, ease: 'elastic.out(1, 0.4)' }, '<')
        }
      })
    }

    svg.addEventListener('mousemove', handleMouseMove)
    return () => {
      svg.removeEventListener('mousemove', handleMouseMove)
      flowersRef.current.forEach((f) => f.animater?.kill())
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">移动鼠标拨动花田，六种花型随机分布</p>
      <a
        href="https://qbitcapital.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-gray-700/60 bg-gray-800/40 px-3 py-1 font-mono text-xs text-gray-500 transition-all hover:border-gray-500 hover:text-gray-300"
      >
        <span className="text-gray-600">参考</span>
        <span className="text-gray-400">↗</span>
        qbitcapital.xyz
      </a>
      <div className="w-full overflow-hidden rounded-2xl border border-gray-700 bg-[#0a0a14]">
        <svg
          ref={svgRef}
          className="h-96 w-full cursor-crosshair"
          style={{ display: 'block' }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['SVG <defs>', '<use> 复用', 'elastic.out', '6 种花型'].map((tag) => (
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
