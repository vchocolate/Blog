---
title: C 语言学习笔记（十二）：指针（下）——指针与函数、指针数组与多级指针
description: 指针真正发挥威力的地方：用指针让函数修改外部变量、数组传参的本质、字符串数组、二级指针与函数指针，以及返回指针的坑。
pubDate: 2026-09-07
tags: ['C语言', '学习笔记']
draft: false
series: 'C 语言学习笔记'
---

上一篇理解了指针是什么，这一篇看它能做什么。

## 指针做函数参数：真正修改变量

还记得第十篇那个交换不了的 `swap` 吗？用指针就能改：

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void) {
    int x = 1, y = 2;
    swap(&x, &y);              // 传地址
    printf("x=%d y=%d\n", x, y); // x=2 y=1
    return 0;
}
```

理解方式：函数还是值传递，只不过传进去的「值」是地址，顺着地址就能改到外面的变量。

**判断一个函数能不能改外部变量的口诀：参数里有指针，就有可能改。**

## 数组传参的本质

```c
void print_array(int a[], int n);    // 写法一
void print_array(int *a, int n);     // 写法二，完全等价
```

两种写法在编译器眼里一样，`a[]` 只是更容易读。函数内部不要用 `sizeof(a)` 求长度，必须靠参数把长度传进来。

## 指针数组与字符串数组

数组的元素是指针：

```c
const char *names[] = {"Alice", "Bob", "Cindy"};

for (int i = 0; i < 3; i++) {
    printf("%s\n", names[i]);
}
```

和二维字符数组的区别：

```c
const char *names1[] = {"Alice", "Bob"};      // 指针数组：每个元素指向各自的字符串
char names2[][10] = {"Alice", "Bob"};          // 二维数组：每行固定 10 字节
```

指针数组更灵活，字符串长短不限；二维数组每行等长，更省指针开销。

## 二级指针

指向指针的指针：

```c
int a = 5;
int *p = &a;
int **pp = &p;

printf("%d\n", **pp);   // 5
```

初学阶段，二级指针最实用的场景是「在函数里修改一个指针」：

```c
void alloc_number(int **out, int value) {
    static int storage;      // 简化演示，真实场景一般用 malloc
    storage = value;
    *out = &storage;
}
```

真正用它最多的地方是动态内存（第十五篇）和字符串数组。

## 函数指针（了解）

函数也有地址，可以存进指针：

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main(void) {
    int (*op)(int, int) = add;     // 定义函数指针
    printf("%d\n", op(3, 2));      // 5

    op = sub;
    printf("%d\n", op(3, 2));      // 1
    return 0;
}
```

标准库的 `qsort` 就接收一个比较函数指针：

```c
#include <stdlib.h>

int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int a[5] = {3, 1, 4, 1, 5};
qsort(a, 5, sizeof(int), cmp_int);
```

## 不要返回指向局部变量的指针

```c
int *danger(void) {
    int x = 10;
    return &x;      // 错！函数结束，x 的内存已失效
}

int *ok(void) {
    static int x = 10;
    return &x;      // 可以，static 变量生命周期到程序结束
}
```

返回栈上局部变量的地址是典型错误，调用方拿到的指针指向已失效内存，行为不可预测。正确做法：用 `static`（有副作用，谨慎）或在堆上 `malloc`（第十五篇）。

## 常见指针错误清单

| 错误 | 后果 |
| --- | --- |
| 未初始化的野指针解引用 | 崩溃或数据损坏 |
| 数组越界后继续指针运算 | 未定义行为 |
| 返回局部变量地址 | 指针悬空 |
| 忘记检查 `malloc` 返回值 | 空指针解引用 |
| `int *p` 解引用前不知道是否有效 | 不可预测 |

## 练习

1. 写 `void minmax(int a[], int n, int *min, int *max)`，一次遍历同时求最小值和最大值。
2. 用指针数组存 3 个字符串，按字典序排序输出。
3. 读一遍 `qsort` 的例子，改写成对 double 数组排序。
4. 找出下面代码的问题并修复：

```c
int *f(void) {
    int a[3] = {1, 2, 3};
    return a;
}
```

下一篇：《结构体、共用体与枚举》。
