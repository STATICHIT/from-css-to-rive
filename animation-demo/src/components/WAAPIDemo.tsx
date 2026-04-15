import { useState } from 'react'
import CodeBlock from './CodeBlock'
import ParticleDemo, { PARTICLE_CODE } from './waapi/ParticleDemo'
import ClipPathTrailDemo, { CLIPPATH_CODE } from './waapi/ClipPathTrailDemo'

const TABS = [
  {
    id: 'particle',
    label: '粒子爆炸',
    code: PARTICLE_CODE,
    lang: 'javascript',
    component: ParticleDemo,
  },
  {
    id: 'clippath',
    label: 'Clip-Path 拖尾',
    code: CLIPPATH_CODE,
    lang: 'javascript',
    component: ClipPathTrailDemo,
  },
]

export default function WAAPIDemo() {
  const [activeId, setActiveId] = useState('particle')
  const activeTab = TABS.find((t) => t.id === activeId)!
  const ActiveDemo = activeTab.component

  return (
    <div className="flex flex-col gap-6">
      {/* Tab 切换器 */}
      <div className="flex gap-1 self-center rounded-xl border border-gray-700 bg-gray-900/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`rounded-lg px-4 py-1.5 font-mono text-sm transition-all ${
              activeId === tab.id
                ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 当前 Tab 代码示例 */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500">{'</>'}</span>
          <span className="font-semibold text-white">代码示例</span>
        </div>
        <CodeBlock code={activeTab.code} language={activeTab.lang} />
      </div>

      {/* 当前 Tab 演示 */}
      <div>
        <div className="mb-3 font-semibold text-white">🎯 交互演示</div>
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/20 p-6">
          <ActiveDemo />
        </div>
      </div>
    </div>
  )
}
