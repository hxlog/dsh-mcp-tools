# dsh-mcp-tools v1.0.1

修复 npm 页面信息问题，功能与 1.0.0 相同。

## 变更

- README 截图改用 jsDelivr CDN，npm 页面与 GitHub 均可正常加载。
- 安装说明更新：npm 包链接、DSH Desktop 安装路径、CLI 自动写入 `dsh.profile.bundles`。
- 新增「这是 DSH 插件，不是普通 npm 依赖库」的提示。
- README 顶部增加 GitHub / npm / Issues 入口与 GitHub 徽章。
- `description` 去掉结尾句号，修复 npm 页面 `settings..` 的双句号。
- `homepage` 指向仓库根地址；`repository` / `bugs` 指向 GitHub。

## 安装

```bash
dsh plugin --profile web add dsh-mcp-tools
```

或 DSH 插件页安装 `dsh-mcp-tools`；安装后重启 `dsh web` / 重开 DSH Desktop。

**Full Changelog**: https://github.com/hxlog/dsh-mcp-tools/compare/v1.0.0...v1.0.1
