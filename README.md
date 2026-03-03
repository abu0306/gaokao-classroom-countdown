# 高考教室倒计时（Windows）

适用于高中教室多媒体设备，支持：

- 班级与学校名称展示（默认：实验高中三（7）班）
- 高考倒计时（默认按“最近的 6 月 7 日”自动计算）
- 每天一条励志语（按日期稳定切换）
- 每天一张背景图（按日期稳定切换）
- 屏保模式（`/s`）与 Windows 自动化脚本

## 架构说明（已改为配置驱动）

- `config/app-config.json`：单一配置源（班级、学校、考试日期规则、时区、语录、背景）
- `src/config/load.mjs`：主进程统一加载并校验配置（支持环境变量覆盖）
- `main.js`：仅负责窗口与平台行为，并通过一次 IPC 下发完整运行配置
- `src/renderer/app.mjs`：纯展示层，按配置渲染倒计时/语录/背景
- `src/core/*`：纯算法层（时间计算、每日稳定选择）

## 1. 环境要求

- Windows 10/11
- Node.js 20+

## 2. 开发运行

```bash
npm install
npm run start
```

## 3. 屏保模式运行

```bash
npm run start -- /s
```

`/s` 模式下全屏显示，键盘或鼠标输入后退出。

## 4. 配置项目（推荐改这个）

编辑：`config/app-config.json`

关键字段：

- `className`: 班级名
- `schoolName`: 学校名
- `countdownLabel`: 标题文案
- `examMonth` / `examDay`: 考试月日（默认 6/7）
- `timeZone`: 时区（建议 `Asia/Shanghai`）
- `quotes`: 励志语数组
- `backgrounds`: 背景图路径数组（相对 `src/renderer/index.html`）

## 5. 环境变量覆盖（可选）

PowerShell 示例：

```powershell
$env:CLASS_NAME="实验高中三（7）班"
$env:TARGET_DATE="2026-06-07"
npm run start
```

## 6. Windows 打包（portable）

```bash
npm run pack:win
```

输出在 `dist/`。

傻瓜式分发建议（给最终用户）：

```bash
npm run pack:user
```

该命令会同时生成：

- 便携版 exe（可直接复制运行）
- 安装版 exe（NSIS 安装器）

## 6.1 给用户的最简操作（推荐）

1. 先运行你发给他的安装包或便携版程序。
2. 双击 `scripts/windows/easy-install.bat`。
3. 完成后就具备：屏保 + 每日自动换壁纸（若存在 wallpapers 目录）。

说明：

- `easy-install` 会自动寻找最新 exe 并完成屏保配置。
- 如果自动识别失败，会提示手动输入 `AppExePath`。
- 如果程序同级目录有 `wallpapers` 文件夹，会自动安装每日壁纸任务。
- 会自动在桌面创建“高考倒计时”快捷方式。

## 6.2 卸载（傻瓜式）

双击：`scripts/windows/easy-uninstall.bat`

它会自动：

- 关闭当前用户屏保配置（移除 `SCRNSAVE.EXE`）
- 删除每日换壁纸计划任务（默认 `GaokaoDailyWallpaper`）
- 删除桌面快捷方式

说明：卸载脚本不会删除程序文件本体，如需彻底删除，请手动删除安装目录或使用安装器卸载。

## 7. 安装为屏幕保护

```powershell
./scripts/windows/install-screensaver.ps1 -ExePath ".\dist\GaokaoCountdown 1.0.0.exe" -TimeoutSeconds 300
```

说明：

- 如果不传 `-ExePath`，脚本会自动尝试 `dist/` 最新 exe
- 会生成同名 `.scr` 并写入当前用户屏保注册表

## 8. 设置桌面壁纸（支持每日自动轮换）

### 8.1 立即设置（单张）

```powershell
./scripts/windows/set-desktop-wallpaper.ps1 -ImagePath ".\wallpapers\classroom.jpg"
```

### 8.2 立即设置（按日期从目录自动挑选）

```powershell
./scripts/windows/set-desktop-wallpaper.ps1 -ImagesDir ".\wallpapers" -TimeZone "China Standard Time"
```

### 8.3 安装“每日自动换壁纸”计划任务

```powershell
./scripts/windows/install-wallpaper-task.ps1 -ImagesDir ".\wallpapers" -RunAt "06:00"
```

卸载计划任务：

```powershell
./scripts/windows/uninstall-wallpaper-task.ps1
```

## 9. 验证

```bash
npm test
npm run lint
```

## 10. GitHub Actions 发布

已包含：`.github/workflows/windows-release.yml`

- 打 tag（如 `v1.0.1`）自动执行 Windows 打包
- 自动创建 Release 并上传 `dist/*.exe` 为 assets
