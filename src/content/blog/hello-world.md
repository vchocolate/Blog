---
title: 建站小记：用 Astro 搭一个安静的个人博客
description: 记录这个博客的搭建过程：为什么选 Astro、项目结构如何组织、如何托管到 GitHub Pages。
pubDate: 2026-09-12
tags: ['Astro', '建站']
draft: false
---

很早以前就想有一个自己的角落，不用迎合算法，也不用追赶热点，只写自己真正想写的东西。终于在这个九月动手了。

## 为什么是 Astro

在 Hugo 和 Astro 之间犹豫了一阵，最后选了 Astro：

- **内容优先**：默认输出静态 HTML，没有多余的客户端 JavaScript；
- **Content Collections**：Markdown 的 frontmatter 有 Zod 类型校验，写错字段在构建时就会报错；
- **扩展自由**：需要交互组件时可以按需引入，而不必一开始就背上整个框架；
- **部署省心**：官方维护的 GitHub Actions 直接把构建产物发布到 Pages。

## 项目结构

站点结构保持简单，容易维护：

```text
src/
├── components/    # 页头、页脚、日期等小组件
├── content/blog/  # 全部文章（Markdown）
├── layouts/       # 页面骨架
├── pages/         # 路由：首页、文章、标签、关于
├── styles/        # 全局样式
└── content.config.ts
```

## 写作流程

新增一篇文章只需要在 `src/content/blog` 下创建一个 Markdown 文件：

```markdown
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-09-12
tags: ['随笔']
draft: false
---

正文从这里开始。
```

写完提交、推送，GitHub Actions 会自动完成构建和部署。草稿设置 `draft: true` 就不会出现在线上。

## 关于风格

配色选了偏暖的纸张色，正文用衬线字体，行距放宽一些。阅读这件事，舒服比炫技重要。

接下来会陆续把旧笔记整理过来。希望这个角落能长久地写下去。
