# 我的博客

基于 Astro 的个人博客，托管在 GitHub Pages。

- 线上地址：<https://vchocolate.github.io/Blog/>
- 仓库地址：<https://github.com/vchocolate/Blog>

## 技术栈

- Astro 7（静态输出，无客户端框架）
- Content Collections + Zod 内容校验
- 原生 CSS，跟随系统深色模式
- GitHub Actions 自动构建部署

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321/Blog/
npm run build      # 构建到 dist/
npm run preview    # 预览 dist/
```

## 写文章

在 `src/content/blog/` 下新建 Markdown 文件：

```markdown
---
title: 文章标题
description: 一句话摘要（用于列表和 SEO）
pubDate: 2026-09-19
tags: ['标签一', '标签二']
draft: false
---

正文。
```

- 文件名即文章 URL：`hello-world.md` → `/posts/hello-world/`
- `draft: true` 仅在本地可见，线上构建自动排除
- 可选 `updatedDate` 显示更新日期
- 新增/修改后推送 `main` 分支即自动部署

## 站点配置

当前配置对应仓库 `vchocolate/Blog`：

| 文件 | 配置项 | 当前值 |
| --- | --- | --- |
| `astro.config.mjs` | `site` | `https://vchocolate.github.io` |
| `astro.config.mjs` | `base` | `/Blog`（必须与仓库名大小写一致，改名需同步修改） |
| `src/consts.ts` | `SITE_TITLE` / `SITE_DESCRIPTION` / `SITE_AUTHOR` / `GITHUB_URL` | 站点标题、描述、作者、GitHub 链接 |

## 部署（GitHub Pages）

1. 在 GitHub 创建仓库 `vchocolate/Blog`（公开仓库）
2. 推送代码到 `main` 分支
3. 仓库 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**
4. 等待 Actions 工作流完成，访问 `https://vchocolate.github.io/Blog/`

之后每次推送 `main` 都会触发自动部署。

## 目录结构

```text
├── .github/workflows/deploy.yml   # 部署流水线
├── public/                        # 静态资源（favicon 等）
├── src/
│   ├── components/                # 页头、页脚、日期等组件
│   ├── content/blog/              # 文章 Markdown
│   ├── layouts/BaseLayout.astro   # 页面骨架
│   ├── pages/                     # 路由页面
│   ├── styles/global.css          # 全局样式
│   ├── consts.ts                  # 站点常量
│   ├── utils.ts                   # 路径工具（base 前缀）
│   └── content.config.ts          # 内容集合 schema
└── astro.config.mjs
```
