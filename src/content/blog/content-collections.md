---
title: 用 Content Collections 管理博客内容
description: Astro 的 Content Collections 为 Markdown 提供了类型安全的数据层，本文记录 schema 设计与常用 API。
pubDate: 2026-09-16
tags: ['Astro', 'TypeScript']
draft: false
---

Astro 的 Content Collections 把 `src/content` 下的文件变成带类型的数据集合，构建时会用 schema 校验 frontmatter，字段写错会直接失败，而不是等到页面渲染出问题才发现。

## 定义集合

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

几个细节：

- `glob` loader 会为每个文件生成 `id`，默认取文件名（不含扩展名）；
- `z.coerce.date()` 会把 frontmatter 里的日期字符串转成 `Date` 对象；
- `default([])` 让 `tags` 字段可以省略。

## 查询与渲染

```astro
---
import { getCollection, render } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => !data.draft);
const sorted = posts.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

const { Content } = await render(sorted[0]);
---

<Content />
```

`getCollection` 的第二个参数是过滤器，很适合用来过滤草稿：

```ts
const visible = await getCollection('blog', ({ data }) =>
  import.meta.env.PROD ? !data.draft : true
);
```

这样开发环境能看到草稿，线上构建自动排除。

## 类型从哪来

运行 `astro dev` 或 `astro sync` 后，Astro 会生成 `.astro/types.d.ts`，`CollectionEntry<'blog'>` 自动带上 schema 推导出的类型。编辑器里输入 `post.data.` 就有完整补全。

> 把内容建模这件事交给 schema，页面代码就只剩展示逻辑，改起来会轻松很多。

## 小结

如果你的博客有几十篇以上的文章，Content Collections 带来的类型安全值得这点前期投入。字段即约定，构建即校验，写作时反而更自由。
