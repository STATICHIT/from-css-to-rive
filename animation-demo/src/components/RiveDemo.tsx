import { useState, useCallback } from 'react'

type MachineState = 'idle' | 'hover' | 'active' | 'success'

const STATE_CONFIG: Record<MachineState, { label: string; color: string; bg: string; icon: string }> = {
  idle: { label: 'Idle', color: 'text-gray-400', bg: 'bg-gray-700/50', icon: '⭕' },
  hover: { label: 'Hover', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '🔵' },
  active: { label: 'Active', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: '🟡' },
  success: { label: 'Success', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: '🟢' },
}

const TRANSITIONS: { from: MachineState; to: MachineState; trigger: string }[] = [
  { from: 'idle', to: 'hover', trigger: 'mouseEnter' },
  { from: 'hover', to: 'idle', trigger: 'mouseLeave' },
  { from: 'hover', to: 'active', trigger: 'mouseDown' },
  { from: 'active', to: 'success', trigger: 'mouseUp' },
  { from: 'success', to: 'idle', trigger: 'timeout(1s)' },
]

export default function RiveDemo() {
  const [state, setState] = useState<MachineState>('idle')
  const [history, setHistory] = useState<string[]>(['→ idle'])

  const log = useCallback((msg: string) => {
    setHistory((h) => [...h.slice(-6), msg])
  }, [])

  const transition = useCallback((to: MachineState, trigger: string) => {
    setState(to)
    log(`${trigger} → ${to}`)
    if (to === 'success') {
      setTimeout(() => {
        setState('idle')
        log('timeout → idle')
      }, 1200)
    }
  }, [log])

  const config = STATE_CONFIG[state]

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">State Machine 模拟 — 鼠标交互驱动状态切换</p>

      <div className="grid w-full grid-cols-2 gap-6">
        {/* Interactive area */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-700 bg-gray-900/80 p-6">
          <span className="font-mono text-xs text-gray-500">Interactive Widget</span>
          <button
            onMouseEnter={() => state === 'idle' && transition('hover', 'mouseEnter')}
            onMouseLeave={() => state === 'hover' && transition('idle', 'mouseLeave')}
            onMouseDown={() => state === 'hover' && transition('active', 'mouseDown')}
            onMouseUp={() => state === 'active' && transition('success', 'mouseUp')}
            className={`flex h-32 w-32 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
              state === 'idle' ? 'border-gray-600 bg-gray-800 shadow-none' :
              state === 'hover' ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/20' :
              state === 'active' ? 'scale-90 border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/20' :
              'scale-110 border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
            }`}
          >
            <span className="text-4xl transition-transform duration-300">{config.icon}</span>
          </button>
          <span className={`rounded-full px-3 py-1 font-mono text-sm font-semibold ${config.color} ${config.bg}`}>
            {config.label}
          </span>
        </div>

        {/* State machine visualization */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-700 bg-gray-900/80 p-6">
          <span className="font-mono text-xs text-gray-500">State Machine</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATE_CONFIG).map(([key, cfg]) => (
              <span
                key={key}
                className={`rounded-md px-2 py-1 font-mono text-xs transition-all ${
                  state === key
                    ? `${cfg.bg} ${cfg.color} ring-1 ring-current`
                    : 'text-gray-600'
                }`}
              >
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>
          <div className="mt-1 space-y-1">
            <span className="font-mono text-xs text-gray-500">Transitions:</span>
            {TRANSITIONS.map((t, i) => (
              <div
                key={i}
                className={`font-mono text-xs ${
                  state === t.from ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {t.from} → {t.to}
                <span className="ml-1 text-gray-500">({t.trigger})</span>
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-gray-700/50 pt-2">
            <span className="font-mono text-xs text-gray-500">Log:</span>
            <div className="mt-1 max-h-20 space-y-0.5 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="font-mono text-xs text-gray-400">{h}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['StateMachine', 'useRive()', 'Inputs', '.riv format'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 font-mono text-xs text-orange-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
