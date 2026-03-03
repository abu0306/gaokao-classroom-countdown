# 高考教室倒计时（Windows）

一个适用于高中教室多媒体设备的倒计时项目：

- 距离高考天数（默认目标日期：`2026-06-07`）
- 每天一条励志语（按日期稳定切换）
- 清爽背景图（按日期稳定切换）
- 支持“屏保风格”全屏模式（`/s`）

## 1. 环境要求

- Windows 10/11
- Node.js 20+

## 2. 安装与运行

```bash
npm install
npm run start
```

## 3. 屏保风格启动

```bash
npm run start -- /s
```

说明：`/s` 模式会全屏展示，并在任意键鼠输入时退出，适合教室待机展示。

## 4. 目标日期配置

默认目标日期在 `main.js` 中为 `2026-06-07`。你也可以通过环境变量临时覆盖：

```bash
TARGET_DATE=2026-06-07 npm run start
```

Windows PowerShell 示例：

```powershell
$env:TARGET_DATE="2026-06-07"; npm run start
```

## 5. 项目结构

- `main.js`: Electron 主进程，窗口模式与屏保参数处理
- `preload.js`: 渲染进程安全桥接
- `src/renderer/`: 页面与样式
- `src/core/`: 倒计时与每日内容选择逻辑
- `src/data/`: 励志语和背景列表
- `test/`: 核心逻辑测试

## 6. 验证命令

```bash
npm test
npm run lint
```

## 7. 后续可扩展

- 增加“教师设置页”（自定义高考日期、字体、背景池）
- 打包为 Windows 安装包并设置开机自启
- 增加远程同步励志语（离线兜底）
