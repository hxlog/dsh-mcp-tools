# dsh-mcp-tools v1.0.0

**DeepSeek Harness 最简洁、优雅的MCP工具管理器。**

在设置里管理外部 MCP 服务器：添加 / 编辑 / 删除、粘贴 `mcpServers` JSON 导入、Postman 式请求头（默认 `x-mcp-key`）、连通性测试、服务器开关、逐工具 chip 开关（真正从模型工具列表移除）、复制配置、最近事件、中英文与深浅色。

## 安装

```bash
# 推荐：DSH Web → 插件页 → 安装 → 输入 dsh-mcp-tools
# 或命令行
dsh plugin --profile web add dsh-mcp-tools
```

然后刷新页面，打开 **设置 → MCP**。

## 亮点

- 停用的工具**不会注册进模型**，省上下文、防误调用
- 请求头键值对行，像 Postman 一样粘密钥
- 测试连接不改状态，回报耗时 / 协议版本 / 工具数

完整说明见 [README](https://github.com/hxlog/dsh-mcp-tools#readme)。
