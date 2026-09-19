---
title: C 语言学习笔记（十五）：动态内存管理
description: 程序的内存布局、栈与堆的区别、malloc/calloc/realloc/free 的正确用法，内存泄漏与悬空指针的成因，动态数组实战。
pubDate: 2026-09-13
tags: ['C语言', '学习笔记']
draft: false
---

数组长度写死不够灵活，动态内存让你在运行时决定要多少内存。

## 程序的内存布局

```text
高地址
┌──────────┐
│   栈     │  局部变量、函数调用，自动分配释放，向下增长
├──────────┤
│          │
│   堆     │  malloc/free 手动管理，向上增长
├──────────┤
│   BSS    │  未初始化的全局/静态变量
├──────────┤
│  数据段  │  已初始化的全局/静态变量、字符串常量
├──────────┤
│  代码段  │  程序指令，只读
└──────────┘
低地址
```

栈内存由系统自动管理，出了作用域就回收；堆内存必须自己申请、自己释放。

## malloc 与 free

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));   // 申请 1 个 int 的空间
    if (p == NULL) {                // 必须检查是否申请失败
        printf("内存分配失败\n");
        return 1;
    }

    *p = 42;
    printf("%d\n", *p);

    free(p);        // 用完全部归还
    p = NULL;       // 防止悬空指针
    return 0;
}
```

三个要点：

1. **检查返回值**：内存不足时返回 `NULL`。
2. **配对释放**：每个 `malloc` 对应一个 `free`，多释放/重复释放都是错误。
3. **释放后置 NULL**：避免误用已释放的指针。

## calloc 与 realloc

```c
int *a = calloc(10, sizeof(int));   // 申请 10 个 int，并清零
// calloc(n, size) 等价于 malloc(n * size) + 手动清零

a = realloc(a, 20 * sizeof(int));   // 扩容到 20 个 int
if (a == NULL) {
    // realloc 失败时原内存仍然有效，注意处理
}
```

`realloc` 常用法（避免丢失原指针）：

```c
int *tmp = realloc(a, new_size);
if (tmp != NULL) {
    a = tmp;
}
```

## 动态数组实战

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("要输入几个数？");
    scanf("%d", &n);

    int *a = malloc(n * sizeof(int));
    if (a == NULL) return 1;

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);           // 动态数组一样用下标
    }

    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
    }
    printf("和 = %d\n", sum);

    free(a);
    return 0;
}
```

## 内存泄漏

```c
void leak(void) {
    int *p = malloc(1000 * sizeof(int));
    // 用完之后忘了 free，函数返回，指针丢失
    // 这 4000 字节直到程序结束都无法再被使用
}

int main(void) {
    for (int i = 0; i < 1000000; i++) {
        leak();     // 反复泄漏，内存一路涨
    }
    return 0;
}
```

对象：**malloc 的数量必须等于 free 的数量**。短命小工具程序影响不大，长期运行的程序会因此被 OOM 杀掉。

## 悬空指针与重复释放

```c
int *p = malloc(sizeof(int));
free(p);
*p = 5;        // 错！悬空指针，内存已被系统收回

int *q = malloc(sizeof(int));
free(q);
free(q);       // 错！重复释放，未定义行为
```

规律：释放后立刻 `p = NULL`，重复 `free(NULL)` 是安全的，重复 `free(非空)` 不安全。

## 常见错误对照表

| 错误 | 表现 |
| --- | --- |
| 忘记 free | 内存泄漏 |
| free 后继续用 | 悬空指针，随机崩溃 |
| 重复 free | 崩溃或堆损坏 |
| 越界写动态数组 | 堆缓冲区溢出 |
| 忘记检查 NULL | 空指针解引用 |
| 用 `sizeof(p)` 当数组长度 | 得到指针大小（8），不是数组长度 |

## 练习

1. 用 malloc 创建长度为 n 的动态数组，倒序打印。
2. 写一个函数返回动态数组的平均值，数组由调用者释放。
3. 故意写一个泄漏程序，用任务管理器/`ps` 观察内存变化。
4. 实现一个「可增长数组」：用 realloc 每次不够就翻倍，体会容量管理。

下一篇：《文件操作》。
