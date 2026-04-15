import CodeBlock from './CodeBlock'
import ParticleDemo, { PARTICLE_CODE } from './waapi/ParticleDemo'

export default function WAAPIDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* 代码示例 */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500">{'</>'}</span>
          <span className="font-semibold text-white">代码示例</span>
        </div>
        <CodeBlock code={PARTICLE_CODE} language="javascript" />
      </div>

      {/* 演示 */}
      <div>
        <div className="mb-3 font-semibold text-white">🎯 交互演示</div>
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/20 p-6">
          <ParticleDemo />
        </div>
      </div>
    </div>
  )
}
