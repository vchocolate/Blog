---
title: C 语言学习笔记（十）：函数——从模块化到递归
description: 函数的定义、声明与调用，值传递的本质，用代码演示为什么交换函数传不过去，递归三例（阶乘、斐波那契、汉诺塔），变量的作用域。
pubDate: 2026-09-03
tags: ['C语言', '学习笔记']
draft: false
---

代码一长就乱，函数是拆解问题的基本工具。

## 定义、声明与调用

```c
#include <stdio.h>

double circle_area(double r);   // 函数声明（原型），告诉编译器有这么一个函数

int main(void) {
    double r = 3.0;
    printf("%.2f\n", circle_area(r));   // 调用
    return 0;
}

double circle_area(double r) {  // 函数定义
    return 3.14159 * r * r;
}
```

- 定义在前面，声明可以省略；定义在后面，必须先声明。
- 参数类型、个数、返回类型要和声明一致。

## 返回值与 void

```c
void print_line(int n) {        // 没有返回值
    for (int i = 0; i < n; i++) putchar('-');
    putchar('\n');
}

int add(int a, int b) {
    return a + b;               // 返回一个值
}
```

`return` 一旦执行，函数立即结束。

## 值传递：最核心的一节

C 的参数传递是**值传递**：函数拿到的是实参的副本。

```c
#include <stdio.h>

void swap_wrong(int a, int b) {
    int t = a; a = b; b = t;    // 只交换了副本
}

int main(void) {
    int x = 1, y = 2;
    swap_wrong(x, y);
    printf("x=%d y=%d\n", x, y);   // 输出 x=1 y=2，没变！
    return 0;
}
```

那怎么才能交换成功？传地址。这是指针篇的重点，先记住结论：

```c
void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}
swap(&x, &y);   // 传地址
```

## 数组作为参数

数组名传参时传递的是首元素地址，函数内部对数组的修改会影响原数组：

```c
void fill_zeros(int a[], int n) {
    for (int i = 0; i < n; i++) a[i] = 0;
}

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    fill_zeros(a, 5);
    // a 现在是全 0
    return 0;
}
```

注意：数组参数必须**另外传长度**，因为函数内部 `sizeof(a)` 得到的是指针大小，不是数组大小。

## 递归

函数调用自己的场景。写递归要抓住两点：**终止条件**和**问题如何缩小**。

### 阶乘

```c
long long factorial(int n) {
    if (n <= 1) return 1;           // 终止条件
    return n * factorial(n - 1);    // 规模缩小
}
```

### 斐波那契（了解低效写法）

```c
int fib(int n) {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
}
```

这个写法存在大量重复计算，n 稍大就非常慢。学习递归概念可以，实际应用改用循环或记忆化。

### 汉诺塔

```c
void hanoi(int n, char from, char to, char via) {
    if (n == 1) {
        printf("%c -> %c\n", from, to);
        return;
    }
    hanoi(n - 1, from, via, to);
    printf("%c -> %c\n", from, to);
    hanoi(n - 1, via, to, from);
}
```

汉诺塔的递归写法极简，但调用次数是 2^n - 1，n=30 就已经很难跑完。这提醒我们：**算法复杂度比代码行数重要**。

## 作用域与存储类别

- 局部变量：函数内声明，出函数即失效。
- 全局变量：所有函数都能访问，滥用会让代码难维护，尽量少用。
- `static` 局部变量：只初始化一次，函数退出后值保留。

```c
void counter(void) {
    static int count = 0;   // 生命周期贯穿整个程序
    count++;
    printf("第 %d 次调用\n", count);
}
```

## 练习

1. 写 `max3(a, b, c)` 返回三个数的最大值。
2. 自己实现 `swap` 的错误版和正确版，观察区别（正确版需要指针，可先参考《指针（下）》）。
3. 用递归与循环分别求 1~n 的和，比较两种写法。
4. 写一个判断素数的函数，在主函数里输出 1~100 的所有素数。

下一篇：《指针（上）：地址、指针与数组》。
