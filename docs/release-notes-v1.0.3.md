# dsh-mcp-tools v1.0.3

交互细节修复：tooltip 宽度、停用服务器的工具管理、stdio 表单高度。

## 修复

- **tooltip 不再固定 320px**：气泡按内容自适应宽度，短标签约 70px；长描述仍有 320px 上限并在气泡内换行，窄屏按视口收窄，靠近边缘时自动夹紧不越界。键盘 focus 行为与延迟不变。
- **停用服务器也能测试、刷新和整理工具**：服务器开关现在只决定「是否注册给模型」。停用状态下仍可点「测试连接」（结果行显示「已停用 · 测试通过 · N 个工具」），工具面板的 chip、搜索、全选 / 反选 / 全部停用以及新增的「刷新工具」全部可用；改动会立即落库，等下次启用时按开关注册。测试/刷新在停用态使用临时连接，不影响运行中的实例，也不会注册工具。
- **stdio 表单更紧凑**：参数 / 环境变量文本框高度从 168px 降到 64px（仍可手动拉伸），JSON 编辑器保留 168px；表单间距收紧。1280×917 下新增 stdio 服务器不再出现弹窗内部滚动。
- 修复停用服务器测试失败时状态行重复前缀（「连接失败：连接失败：…」）。

## 安装 / 升级

已发布到 npm：**`dsh-mcp-tools@1.0.3`**（<https://www.npmjs.com/package/dsh-mcp-tools>，`latest`）。

```bash
dsh plugin --profile web add dsh-mcp-tools      # Web
dsh plugin --profile desktop add dsh-mcp-tools  # Desktop
```

装好后重启 `dsh web` / DSH Desktop 生效；已装旧版本的 profile 重新执行上面的 add 即可升级。

**Full Changelog**: https://github.com/hxlog/dsh-mcp-tools/compare/v1.0.2...v1.0.3
