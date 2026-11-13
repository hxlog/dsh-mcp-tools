# dsh-mcp-tools v1.1.1

添加 / 编辑服务器弹窗新增「测试连接」按钮：保存前就能知道接口通不通。

## 新增

- **弹窗内测试连接**：底部左侧新增「测试连接」按钮，直接用当前表单里的值（传输方式、URL、请求头；stdio 则是命令 / 参数 / 环境变量）发起一次临时探测，不需要先保存。成功显示「连接成功 · 耗时 ms · N 个工具」；失败直接展示原因（鉴权、404、超时等）。
- 测试只校验连接相关字段，不要求先填名称；测试过程中按钮显示「测试中…」，不能重复点击或关闭弹窗。
- 修改任意字段或请求头行会清空上一次测试结果，避免看到过期的「连接成功」。

## 安装 / 升级

已发布到 npm：**`dsh-mcp-tools@1.1.1`**（<https://www.npmjs.com/package/dsh-mcp-tools>，`latest`）。

```bash
dsh plugin --profile web add dsh-mcp-tools      # Web
dsh plugin --profile desktop add dsh-mcp-tools  # Desktop
```

装好后重启 `dsh web` / DSH Desktop 生效。

**Full Changelog**: https://github.com/hxlog/dsh-mcp-tools/compare/v1.1.0...v1.1.1
