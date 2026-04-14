# Web 动画不完全指南

> 从"动起来"到"活起来"——五种 Web 动画技术的对比演示与讲解辅助工具

## 项目简介

这是一个用于技术分享的本地演示网站，覆盖了 Web 动画领域从基础到前沿的五种核心技术，每个章节包含原理讲解、代码示例和可交互的 Demo。

## 技术栈

- **框架**：React 18 + TypeScript + Vite
- **样式**：Tailwind CSS v4（深色极客风格）
- **代码高亮**：Prism.js
- **动画库**：GSAP · lottie-web · @rive-app/react-canvas
- **图标**：lucide-react

## 章节内容

| # | 章节 | 核心技术 | Demo |
|---|------|----------|------|
| 1 | CSS Animations | `transition` · `@keyframes` | 心跳点赞按钮 |
| 2 | Web Animations API | `Element.animate()` · `playbackRate` | 点击粒子爆炸 |
| 3 | GSAP | `timeline()` · `stagger` | 方块编排进场动画 |
| 4 | Lottie | `lottie-web` · JSON 动画 | 矢量动画播放控制 |
| 5 | Rive | State Machine · Inputs | 状态机交互模拟 |

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173) 即可访问。

## 目录结构

```
src/
├── App.tsx                  # 主布局（左侧导航 + 右侧内容）
├── data/
│   └── content.ts           # 五章节数据（标题、描述、代码示例）
└── components/
    ├── CodeBlock.tsx         # Prism.js 代码高亮组件
    ├── CSSAnimationDemo.tsx  # CSS 动画 Demo
    ├── WAAPIDemo.tsx         # Web Animations API Demo
    ├── GSAPDemo.tsx          # GSAP Timeline Demo
    ├── LottieDemo.tsx        # Lottie 矢量动画 Demo
    └── RiveDemo.tsx          # Rive 状态机 Demo
```
