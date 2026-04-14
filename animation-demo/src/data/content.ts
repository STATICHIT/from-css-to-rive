export interface Chapter {
  id: string
  title: string
  subtitle: string
  icon: string
  description: string
  useCases: string[]
  prosAndCons: { pros: string[]; cons: string[] }
  codeExample: string
  codeLang: string
}

export const chapters: Chapter[] = [
  {
    id: 'css-animations',
    title: 'CSS Animations',
    subtitle: '声明式动画的基石',
    icon: 'Paintbrush',
    description:
      'CSS Transition 和 Keyframes 是 Web 动画的基础。Transition 处理状态间的平滑过渡，Keyframes 定义多步骤的复杂动画序列。它们由浏览器合成线程驱动，天然具备 GPU 加速能力，性能开销极低。',
    useCases: ['Hover / Focus 状态反馈', '简单的入场与退场效果', '循环装饰动画', '微交互（按钮、开关）'],
    prosAndCons: {
      pros: ['零 JS 依赖，性能最优', '自动触发 GPU 合成层', '浏览器可优化不可见动画'],
      cons: ['无法精细控制时间轴', '难以实现基于事件的动态编排', '不支持 JS 值插值'],
    },
    codeExample: `/* Transition: 状态间平滑过渡 */
.btn {
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn:hover {
  transform: scale(1.05);
}

/* Keyframes: 心跳动画 */
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.25); }
  30% { transform: scale(1); }
  45% { transform: scale(1.15); }
}
.heart.active {
  animation: heartbeat 0.8s ease-in-out;
}`,
    codeLang: 'css',
  },
  {
    id: 'waapi',
    title: 'Web Animations API',
    subtitle: '浏览器原生的 JS 动画接口',
    icon: 'Sparkles',
    description:
      'WAAPI 是 W3C 标准，提供与 CSS 动画相同的渲染管线，但通过 JavaScript 暴露了完整的播放控制能力：play / pause / reverse / playbackRate / finish 等。它是 CSS 动画和 JS 动画的桥梁，兼具性能与灵活性。',
    useCases: ['需要运行时控制的动画', '基于用户交互的动态效果', '粒子系统 / 随机参数动画', '需要 Promise 完成回调的编排'],
    prosAndCons: {
      pros: ['原生 API，无需引入第三方库', '与 CSS 动画共享渲染管线', '支持 Promise（animation.finished）'],
      cons: ['时间轴编排能力有限', '复杂交错动画代码量大', '部分高级特性浏览器支持不一'],
    },
    codeExample: `// 使用 Element.animate() 创建动画
const el = document.querySelector('.particle');

const animation = el.animate(
  [
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: \`translate(\${x}px, \${y}px) scale(0)\`, opacity: 0 }
  ],
  {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards'
  }
);

// 播放控制
animation.pause();
animation.playbackRate = 2;
animation.reverse();

// 完成回调
await animation.finished;
console.log('Animation complete');`,
    codeLang: 'javascript',
  },
  {
    id: 'gsap',
    title: 'GSAP',
    subtitle: '专业级动画工具链',
    icon: 'Clapperboard',
    description:
      'GreenSock Animation Platform 是业界最强大的 JS 动画库。核心优势在于 Timeline（时间轴编排）、丰富的缓动函数、ScrollTrigger 插件以及跨浏览器的像素级一致性。适用于需要精确控制的复杂动画场景。',
    useCases: ['多元素交错进场序列', '滚动驱动动画（ScrollTrigger）', 'SVG / Canvas 复杂路径动画', '页面转场 / 叙事型动画'],
    prosAndCons: {
      pros: ['时间轴嵌套，精准编排', '200+ 缓动函数', 'ScrollTrigger 滚动联动', '跨浏览器像素级一致'],
      cons: ['需引入第三方库 (~30KB)', '学习曲线相对陡峭', '商业项目需注意 License'],
    },
    codeExample: '',
    codeLang: 'javascript',
  },
  {
    id: 'lottie',
    title: 'Lottie',
    subtitle: '设计稿动画的完美还原',
    icon: 'Film',
    description:
      'Lottie 将 After Effects 动画导出为轻量级 JSON，在 Web / iOS / Android 上实现矢量级还原。动画师用 Bodymovin 插件导出，开发者零成本接入。文件体积远小于 GIF/视频，且支持任意缩放不失真。',
    useCases: ['品牌动画 / Loading', '引导页 / 空状态插画', '图标微动效', '营销活动复杂动画'],
    prosAndCons: {
      pros: ['设计还原度 100%', '矢量渲染，任意缩放', 'JSON 体积远小于视频 / GIF', '全平台一致表现'],
      cons: ['不支持运行时修改关键帧', '复杂动画 JSON 可能很大', '3D / 粒子等 AE 特性不支持', '渲染性能取决于复杂度'],
    },
    codeExample: `import Lottie from 'lottie-react';
import animationData from './animation.json';

function LottieDemo() {
  const lottieRef = useRef(null);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 300, height: 300 }}
      onComplete={() => console.log('Done!')}
    />
  );
}

// 控制播放
lottieRef.current?.goToAndPlay(0);
lottieRef.current?.setSpeed(2);
lottieRef.current?.setDirection(-1);`,
    codeLang: 'jsx',
  },
  {
    id: 'rive',
    title: 'Rive',
    subtitle: '下一代交互式动画引擎',
    icon: 'Gamepad2',
    description:
      'Rive（原 Flare）提供专属编辑器 + 高性能运行时，核心特色是 State Machine——通过可视化状态图定义动画间的切换逻辑。运行时基于自研渲染引擎（非 Lottie 的 SVG/Canvas），帧率更高、文件更小。',
    useCases: ['交互式角色 / 吉祥物', '带状态的按钮 / 开关动画', '游戏 UI 动效', '数据驱动的实时动画'],
    prosAndCons: {
      pros: ['State Machine 驱动交互', '自研渲染引擎，性能卓越', '.riv 体积极小', '实时响应输入（鼠标 / 触摸）'],
      cons: ['需使用 Rive 专属编辑器', '生态不如 Lottie 成熟', '学习成本较高', 'Web 运行时体积 ~200KB'],
    },
    codeExample: `import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

function RiveDemo() {
  const { rive, RiveComponent } = useRive({
    src: '/animation.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  // 获取状态机输入
  const hoverInput = useStateMachineInput(
    rive, 'State Machine 1', 'isHovered'
  );

  return (
    <RiveComponent
      onMouseEnter={() => hoverInput && (hoverInput.value = true)}
      onMouseLeave={() => hoverInput && (hoverInput.value = false)}
      style={{ width: 400, height: 400 }}
    />
  );
}`,
    codeLang: 'jsx',
  },
]
