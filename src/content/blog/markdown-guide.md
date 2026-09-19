---
title: Markdown 排版样例
description: 一篇用于检查博客样式效果的测试文章，涵盖标题、列表、引用、代码、表格等常见元素。
pubDate: 2026-09-18
tags: ['写作', 'Markdown']
draft: false
---

这篇文章把常见的 Markdown 元素过一遍，用来检查排版细节。

## 文本样式

正文可以有 **加粗**、*斜体*、~~删除线~~，以及 `行内代码`。链接样式如 [Astro 官网](https://astro.build)。

## 列表

无序列表：

- 第一项，用来确认行距与缩进；
- 第二项，包含一段稍长的文字，用来观察换行后的视觉效果是否仍然舒适；
- 第三项，嵌套列表：
  - 嵌套项一；
  - 嵌套项二。

有序列表：

1. 打开编辑器；
2. 写下第一行字；
3. 推送，等待部署完成。

## 引用

> 写作这件事，完成比完美重要。
>
> —— 某个深夜写不出开头的人

## 代码

行内代码如 `npm run dev`，代码块：

```ts
interface Post {
  title: string;
  pubDate: Date;
  tags: string[];
}

export function isPublished(post: Post): boolean {
  return post.pubDate <= new Date();
}
```

## 表格

| 命令 | 作用 | 频率 |
| --- | --- | --- |
| `npm run dev` | 启动本地开发服务器 | 高频 |
| `npm run build` | 构建生产版本 | 提交前 |
| `npm run preview` | 预览构建产物 | 按需 |

## 分隔线

---

如果以上元素显示正常，说明样式表已经覆盖到位。
