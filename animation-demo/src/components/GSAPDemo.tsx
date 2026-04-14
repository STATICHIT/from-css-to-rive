import { useState } from 'react'
import CodeBlock from './CodeBlock'
import TimelineDemo, { TIMELINE_CODE } from './gsap/TimelineDemo'
import MagneticYoyoDemo, { MAGNETIC_CODE } from './gsap/MagneticYoyoDemo'

const TABS = [
  {
    id: 'timeline',
    label: 'Timeline 编排',
    code: TIMELINE_CODE,
    lang: 'javascript',
    component: TimelineDemo,
  },
  {
    id: 'magnetic',
    label: '磁力溜溜球',
    code: MAGNETIC_CODE,
    lang: 'javascript',
    component: MagneticYoyoDemo,
  },
]

export default function GSAPDemo() {
  const [activeId, setActiveId] = useState('timeline')
  const activeTab = TABS.find((t) => t.id === activeId)!
  const ActiveDemo = activeTab.component

  return (
    <div className="flex flex-col gap-6">
      {/* Tab switcher */}
      <div className="flex gap-1 self-center rounded-xl border border-gray-700 bg-gray-900/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`rounded-lg px-4 py-1.5 font-mono text-sm transition-all ${
              activeId === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Per-tab code example */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500">{'</>'}</span>
          <span className="font-semibold text-white">代码示例</span>
        </div>
        <CodeBlock code={activeTab.code} language={activeTab.lang} />
      </div>

      {/* Per-tab demo */}
      <div>
        <div className="mb-3 font-semibold text-white">🎯 交互演示</div>
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/20 p-6">
          <ActiveDemo />
        </div>
      </div>
    </div>
  )
}
