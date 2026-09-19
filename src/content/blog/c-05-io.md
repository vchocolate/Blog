---
title: C 语言学习笔记（五）：输入输出 printf 与 scanf
description: 格式化输入输出完全指南：常用格式说明符、宽度与精度、scanf 的取地址与缓冲区陷阱，以及字符输入函数。
pubDate: 2026-08-24
tags: ['C语言', '学习笔记']
draft: false
series: 'C 语言学习笔记'
---

程序的交互离不开输入输出。`printf` 和 `scanf` 用起来简单，但坑不少。

## printf：格式化输出

```c
#include <stdio.h>

int main(void) {
    int n = 42;
    double pi = 3.14159;
    char c = 'A';
    char name[] = "小明";

    printf("%d\n", n);          // 整数
    printf("%f\n", pi);         // 默认 6 位小数：3.141590
    printf("%.2f\n", pi);       // 保留 2 位：3.14
    printf("%c\n", c);          // 字符
    printf("%s\n", name);       // 字符串
    printf("%5d|\n", n);        // 宽度 5，右对齐：   42|
    printf("%-5d|\n", n);       // 宽度 5，左对齐：42   |
    printf("%05d\n", n);        // 补零：00042
    printf("%%\n");             // 输出一个 % 号
    return 0;
}
```

常用格式说明符：

| 说明符 | 类型 | 说明 |
| --- | --- | --- |
| `%d` | int | 十进制整数 |
| `%u` | unsigned | 无符号 |
| `%ld` `%lld` | long / long long | 长整型 |
| `%f` | float/double | 浮点，输出时一律用 %f |
| `%lf` | double | **输入**时必须用 %lf |
| `%c` | char | 单个字符 |
| `%s` | 字符数组 | 字符串 |
| `%zu` | size_t | sizeof 的结果 |
| `%p` | 指针 | 地址 |

## scanf：格式化输入

```c
int age;
double height;
scanf("%d", &age);       // 注意 & 取地址
scanf("%lf", &height);   // double 输入必须用 %lf
```

**最容易犯的错：漏掉 `&`**。漏了通常不会报错，而是运行时崩溃或数据错乱。

### 输入格式要一致

```c
int a, b;
scanf("%d %d", &a, &b);      // 输入：3 4
scanf("%d,%d", &a, &b);      // 输入：3,4（逗号也要照打）
```

## scanf 的经典陷阱

### 陷阱一：%c 会读到空格和回车

```c
int n;
char c;
scanf("%d", &n);
scanf("%c", &c);  // 读到的可能是上一行残留的回车符！
```

解决：中间加一个空格 `scanf(" %c", &c);`（%c 前的空格表示跳过空白字符）。

### 陷阱二：输入类型不匹配导致死循环

```c
int n;
while (scanf("%d", &n) != 1) {
    printf("输入的不是数字，请重新输入：\n");
    while (getchar() != '\n');  // 清空缓冲区，否则死循环
}
```

`scanf` 失败时会把错误字符留在缓冲区里，不清掉就会反复失败。

### 陷阱三：%s 无法读入带空格的字符串

```c
char name[20];
scanf("%s", name);        // 遇到空格就停止
```

要读一整行（含空格），用 `fgets`（详见第九篇）。

## 字符级输入输出

```c
#include <stdio.h>

int main(void) {
    int ch;                 // 注意用 int 而不是 char，便于判断 EOF
    while ((ch = getchar()) != EOF) {
        putchar(ch);        // 原样输出，简单实现「回显」
    }
    return 0;
}
```

- `getchar()` 读一个字符，`putchar()` 输出一个字符。
- 行末按 `Ctrl+Z`（Windows）再回车、或 `Ctrl+D`（Linux/macOS）表示 EOF。

## 练习

1. 输入圆半径，输出面积和周长，保留两位小数。
2. 输入一个三位整数，分别输出百位、十位、个位（用 `/` 和 `%`）。
3. 复现 %c 陷阱：先输整数再输字符，观察问题并修复。

下一篇：《选择结构：if 与 switch》。
