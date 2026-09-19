---
title: C 语言学习笔记（十四）：预处理与多文件编程
description: 宏定义的正确姿势与括号陷阱、条件编译、头文件卫士、预定义宏，以及把程序拆成多个 .c 与 .h 文件的规范做法。
pubDate: 2026-09-11
tags: ['C语言', '学习笔记']
draft: false
---

以 `#` 开头的都是预处理指令，编译之前由预处理器处理。

## 宏定义

```c
#define PI 3.14159          // 无参宏
#define MAX(a, b) ((a) > (b) ? (a) : (b))   // 有参宏
```

预处理就是**纯文本替换**。替换的本质决定了所有坑：

### 坑一：没有括号

```c
#define SQUARE(x) x * x

int r = SQUARE(1 + 2);     // 展开成 1 + 2 * 1 + 2 = 5，不是 9！
#define SQUARE(x) ((x) * (x))   // 正确写法：每个参数和整体都加括号
```

### 坑二：副作用被重复执行

```c
#define MAX(a, b) ((a) > (b) ? (a) : (b))
int m = MAX(i++, j);   // i++ 会被执行两次，结果不可控
```

有副作用的表达式不要传给宏。**能用函数就用函数，能用 const 就用 const**。

### const 与宏怎么选

```c
#define SIZE 100          // 无类型，预处理替换
const int SIZE2 = 100;    // 有类型，编译器能检查，调试可见
```

常量优先 `const`；宏更适合条件编译和必须文本替换的场景。

## 条件编译

```c
#define DEBUG 1

#if DEBUG
    printf("调试信息：x = %d\n", x);
#endif

#ifdef _WIN32
    // Windows 专属代码
#else
    // 其他平台
#endif
```

用途：调试开关、跨平台适配、包含不同头文件。`#if 0 ... #endif` 也常用来临时「注释」一大段代码。

## 头文件卫士

头文件被重复包含会报重定义错误，标准解法：

```c
// student.h
#ifndef STUDENT_H
#define STUDENT_H

typedef struct {
    char name[20];
    int score;
} Student;

void print_student(const Student *s);

#endif
```

或者用非标准但被广泛支持的：

```c
#pragma once
```

两种写法都行，团队统一即可。

## 预定义宏

```c
printf("文件: %s\n", __FILE__);
printf("行号: %d\n", __LINE__);
printf("函数: %s\n", __func__);
printf("编译日期: %s %s\n", __DATE__, __TIME__);
```

调试时非常有用，配合 `#ifdef DEBUG` 可以打出带位置的日志。

## 多文件编程

项目变大后，按职责拆分文件：

```text
project/
├── main.c        // 程序入口，调用功能函数
├── student.c     // 学生相关函数实现
└── student.h     // 函数声明、结构体定义（对外接口）
```

```c
// student.h
#ifndef STUDENT_H
#define STUDENT_H

typedef struct {
    char name[20];
    int score;
} Student;

void print_student(const Student *s);

#endif
```

```c
// student.c
#include <stdio.h>
#include "student.h"

void print_student(const Student *s) {
    printf("%s: %d\n", s->name, s->score);
}
```

```c
// main.c
#include "student.h"

int main(void) {
    Student s = {"小明", 92};
    print_student(&s);
    return 0;
}
```

编译：

```bash
gcc main.c student.c -o app
```

要点：

- `.h` 放声明和类型定义，`.c` 放实现。
- 自己写的头文件用 `#include "xxx.h"`（双引号），标准库用 `<stdio.h>`（尖括号）。
- 全局变量和函数默认外部可见；只在本文件使用的函数加 `static` 限定。

## 练习

1. 写一个宏 `MIN(a, b)`，保证任意表达式传入都正确，然后故意用不带括号的版本验证错误结果。
2. 建一个 `mathutils.h` / `mathutils.c` / `main.c` 三个文件的小项目，实现求最大公约数与最小公倍数。
3. 用 `__FILE__` 和 `__LINE__` 封装一个简单的调试输出宏。

下一篇：《动态内存管理》。
