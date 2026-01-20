# 🎨 AI 你画我猜 (AI Draw & Guess)

欢迎来到 **AI 你画我猜**！这是一个基于 Next.js 和 React 构建的互动网页游戏。在这个游戏中，你需要根据题目画出相应的图案，而我们的（模拟）AI 将会实时尝试猜测你画的是什么。

## 🎮 游戏玩法

1.  **开始游戏**：点击主界面的“开始游戏”按钮。
2.  **获取题目**：系统会随机给出一个词语（如：苹果、猫、太阳等），你可以选择点击“显示题目”查看，或保持隐藏增加挑战性。
3.  **尽情创作**：在画板上使用不同颜色和粗细的画笔描绘题目。
4.  **AI 猜测**：当你绘画时，AI 会观察你的进度并进行猜测。
    *   画得越快、越清晰，AI 猜中的几率越高！
    *   你需要时刻关注 AI 的猜测列表。
5.  **获胜条件**：如果 AI 在倒计时结束前猜中了正确答案，你将获得积分奖励！

## ✨ 核心特性

*   **实时交互画板**：
    *   支持鼠标和触摸屏操作。
    *   提供多种画笔颜色（8种）和粗细（5档）选择。
    *   一键清空和撤销（清空）功能。
*   **模拟 AI 互动**：
    *   内置模拟 AI 逻辑，根据绘画进度和随机概率进行猜测。
    *   实时反馈猜测结果和置信度。
*   **游戏机制**：
    *   **倒计时系统**：每轮 60 秒，增加紧张感。
    *   **计分系统**：根据剩余时间和回合数计算得分。
    *   **多词库分类**：涵盖动物、食物、物品、自然等多个类别。
*   **现代 UI 设计**：
    *   基于 Tailwind CSS 4 构建的精美界面。
    *   全响应式设计，适配桌面和移动设备。
    *   流畅的动画效果和视觉反馈。

## 🛠️ 技术栈

本项目使用最新的前端技术构建：

*   **框架**: [Next.js 16](https://nextjs.org/) (App Router)
*   **核心库**: [React 19](https://react.dev/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **代码规范**: ESLint

## 🚀 快速开始

### 环境要求

*   Node.js 18.17 或更高版本
*   npm / yarn / pnpm / bun

### 安装步骤

1.  克隆仓库：
    ```bash
    git clone https://github.com/Suow1/opencodeDemo.git
    cd opencodeDemo/draw-guess-game
    ```

2.  安装依赖：
    ```bash
    npm install
    # 或者
    yarn install
    ```

3.  启动开发服务器：
    ```bash
    npm run dev
    ```

4.  打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始游戏！

## 📂 项目结构

```
src/
├── app/
│   ├── layout.tsx      # 全局布局
│   ├── page.tsx        # 游戏主页入口
│   └── globals.css     # 全局样式 (Tailwind)
├── components/
│   ├── Game.tsx        # 游戏核心逻辑组件
│   └── DrawingCanvas.tsx # 画板组件 (Canvas API)
└── lib/
    └── gameLogic.ts    # 游戏词库与 AI 模拟逻辑
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进这个项目！你可以尝试：
*   添加更多有趣的词库。
*   接入真实的 Vision AI (如 OpenAI Vision API) 来替换模拟逻辑。
*   增加多人联机对战功能。

## 📄 许可证

MIT License
