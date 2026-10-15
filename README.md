# Eslies Liu

静态个人站点。文章在 Obsidian 里写，推到 `main` 后由 GitHub Actions 发布到 GitHub Pages。

## 本地

```bash
npm install
npm run dev
```

`npm run build` 是线上同款构建，草稿不会进 `dist/`。

## 从现有 Obsidian 库导入

笔记目前在 `~/Documents/Obsidian Vault`。这个目录不在仓库里，页面默认读不到。导入一次：

```bash
npm run import:obsidian
```

脚本会把 Markdown 抄到 `content/posts`，附件抄到 `content/assets`，并把 `[[双链]]` 改成站内链接。库里改完笔记后，再跑一次同样的命令。换库的位置用 `OBSIDIAN_VAULT=/path/to/vault npm run import:obsidian`。

## 写文章

也可以直接用 Obsidian 打开仓库里的 `content` 目录，不要打开整个仓库，避免扫进 `node_modules`。

建议：

- 设置 → 文件与链接 → 关闭「使用 Wiki 链接」，改成相对路径
- 附件文件夹设为 `assets`
- 技术文放 `posts/`，随笔放 `essays/`

每篇笔记的 frontmatter：

```yaml
title: 标题
date: 2026-10-15
description: 列表和 RSS 用的摘要
tags:
  - 标签
draft: false
```

`date` 只写 `YYYY-MM-DD`。`draft: true` 只在本地开发服务器出现。

首页介绍、名字和 GitHub 链接改 `src/site.ts`。

`content/essays/draft.md` 是随笔草稿示例，确认过之后可以删。

## 发布

仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。之后推 `main` 会走 `.github/workflows/deploy.yml`。

站点地址是 `https://esliesliu.github.io/`。

## 动效

[React Bits](https://reactbits.dev/get-started/introduction) 的源码在 `src/components` 里，只用在首页：粒子背景、名字进场、身份那一行、文章卡片。正文页不加 WebGL。
