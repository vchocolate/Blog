---
title: C 语言学习笔记（十六）：文件操作
description: 从 FILE 指针到常用读写函数：fopen 模式、fprintf/fscanf、fgets/fputs 逐行处理，文件复制与成绩管理实战，附错误处理规范。
pubDate: 2026-09-15
tags: ['C语言', '学习笔记']
draft: false
series: 'C 语言学习笔记'
---

程序运行结束数据就没了，要持久保存就得写进文件。

## 打开与关闭

```c
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("data.txt", "r");
    if (fp == NULL) {                 // 打开失败必须检查
        perror("fopen");              // 打印失败原因
        return 1;
    }

    // ... 读写操作

    fclose(fp);                       // 用完必须关闭
    return 0;
}
```

常用打开模式：

| 模式 | 含义 | 文件不存在时 |
| --- | --- | --- |
| `"r"` | 只读 | 失败返回 NULL |
| `"w"` | 只写，清空原内容 | 创建新文件 |
| `"a"` | 追加 | 创建新文件 |
| `"r+"` | 读写 | 失败返回 NULL |
| `"w+"` | 读写，清空 | 创建新文件 |

默认是**文本模式**；Windows 上二进制文件要加 `b`，如 `"rb"`、`"wb"`。

## 格式化读写

```c
// 写入
FILE *fp = fopen("scores.txt", "w");
fprintf(fp, "%s %d %.1f\n", "小明", 20260001, 92.5);
fclose(fp);

// 读取
fp = fopen("scores.txt", "r");
char name[20];
int id;
double score;
fscanf(fp, "%s %d %lf", name, &id, &score);   // 注意取地址
printf("%s %d %.1f\n", name, id, score);
fclose(fp);
```

`fprintf`/`fscanf` 的用法和 `printf`/`scanf` 一致，只是多了文件指针参数。

## 逐行读写（最常用）

```c
FILE *fp = fopen("input.txt", "r");
if (!fp) { perror("fopen"); return 1; }

char line[256];
while (fgets(line, sizeof(line), fp) != NULL) {
    printf("%s", line);          // line 自带换行
}

fclose(fp);
```

写入：

```c
FILE *out = fopen("copy.txt", "w");
fputs("hello\n", out);
fputs("world\n", out);
fclose(out);
```

## 文件复制实战

```c
#include <stdio.h>

int main(void) {
    FILE *src = fopen("src.txt", "rb");
    if (!src) { perror("源文件"); return 1; }

    FILE *dst = fopen("dst.txt", "wb");
    if (!dst) { perror("目标文件"); fclose(src); return 1; }

    char buf[4096];
    size_t n;
    while ((n = fread(buf, 1, sizeof(buf), src)) > 0) {
        fwrite(buf, 1, n, dst);      // 注意写 n 个字节，不是 sizeof(buf)
    }

    fclose(src);
    fclose(dst);
    printf("复制完成\n");
    return 0;
}
```

逐字节版本用 `fgetc` / `fputc`，逻辑更直观：

```c
int ch;
while ((ch = fgetc(src)) != EOF) {
    fputc(ch, dst);
}
```

`fgetc` 返回 `int` 而不是 `char`，这样 EOF（-1）才能和普通字节区分开。

## feof 的正确用法

`feof` 只在**读失败之后**才返回真，不要这样写：

```c
while (!feof(fp)) {          // 错！会多读一次最后一行
    fgets(line, sizeof(line), fp);
}
```

正确写法就是前面那种：以 `fgets`/`fread` 的返回值作为循环条件。

## 成绩管理小例子

```c
// 追加一条记录
FILE *fp = fopen("scores.txt", "a");
if (!fp) { perror("fopen"); return 1; }
fprintf(fp, "%s %d %.1f\n", name, id, score);
fclose(fp);

// 读取全部并统计
fp = fopen("scores.txt", "r");
double sum = 0;
int count = 0;
while (fscanf(fp, "%19s %d %lf", name, &id, &score) == 3) {
    sum += score;
    count++;
}
fclose(fp);
printf("共 %d 人，平均 %.1f\n", count, sum / count);
```

用 `fscanf` 返回值判断是否读到完整数据，能自动处理格式错误和文件结束。

## 其他常用函数

| 函数 | 作用 |
| --- | --- |
| `fseek(fp, offset, whence)` | 移动读写位置（SEEK_SET/CUR/END） |
| `ftell(fp)` | 当前偏移量，配合 fseek 可求文件大小 |
| `rewind(fp)` | 回到文件开头 |
| `remove(path)` | 删除文件 |
| `rename(old, new)` | 重命名 |

求文件大小：

```c
fseek(fp, 0, SEEK_END);
long size = ftell(fp);
rewind(fp);
```

## 练习

1. 从键盘输入若干行文本，写入 `note.txt`，输入空行结束。
2. 统计一个文本文件的行数、单词数、字符数（简易版 wc）。
3. 读取成绩文件，输出不及格学生名单，并把结果写回新文件。
4. 写程序给文件每行加上行号后另存。

下一篇：《常见错误、调试与综合练习》（完结篇）。
