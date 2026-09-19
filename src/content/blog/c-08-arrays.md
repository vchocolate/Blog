---
title: C 语言学习笔记（八）：数组（一维与二维）
description: 数组的定义、初始化与遍历，越界的危害，最大值/逆序/冒泡排序/二分查找实战，二维数组与矩阵基础。
pubDate: 2026-08-30
tags: ['C语言', '学习笔记']
draft: false
series: 'C 语言学习笔记'
---

要存一组同类型的数据，就用数组。

## 一维数组

```c
int a[5];                    // 声明：5 个 int，未初始化，值是随机的
int b[5] = {1, 2, 3, 4, 5};  // 全部初始化
int c[5] = {1, 2};           // 前两个为 1、2，其余自动为 0
int d[] = {1, 2, 3};         // 省略长度，编译器数：长度为 3
```

要点：

- 下标**从 0 开始**，`a[0]` 是第一个元素，`a[4]` 是第五个。
- 数组长度必须是**编译期常量**（C99 支持变长数组，但初学不建议依赖）。
- 数组名在大多数场合会退化为「首元素地址」，这一点在指针篇细讲。

## 遍历

```c
int a[5] = {3, 1, 4, 1, 5};

for (int i = 0; i < 5; i++) {
    printf("%d ", a[i]);
}
```

**循环条件用 `< 长度`，不要用 `<= 长度`**——越界访问。

## 越界的危害

```c
int a[3] = {1, 2, 3};
a[3] = 100;   // 越界！编译不一定报错，运行时可能改掉别的变量，甚至崩溃
```

C 不检查数组下标，越界是未定义行为。小数组越界可能「看起来正常」，这种 bug 最难查。

## 实战一：求最大值与平均值

```c
#include <stdio.h>

int main(void) {
    int n;
    int a[100];
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int max = a[0];
    double sum = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > max) max = a[i];
        sum += a[i];
    }

    printf("max=%d avg=%.2f\n", max, sum / n);
    return 0;
}
```

## 实战二：逆序

```c
// 原地交换，只需遍历一半
for (int i = 0, j = n - 1; i < j; i++, j--) {
    int t = a[i];
    a[i] = a[j];
    a[j] = t;
}
```

## 实战三：冒泡排序

```c
void bubble_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
                swapped = 1;
            }
        }
        if (!swapped) break;   // 本轮没有交换说明已经有序
    }
}
```

理解要点：每一轮把当前最大的数「冒」到末尾，需要 n-1 轮。

## 实战四：二分查找（有序数组）

```c
int binary_search(int a[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防溢出写法
        if (a[mid] == target) return mid;
        if (a[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;   // 没找到
}
```

前提：**数组必须有序**。时间复杂度 O(log n)，比逐个查找快得多。

## 二维数组

```c
int m[3][4];                        // 3 行 4 列
int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
int h[][2] = {{1, 2}, {3, 4}, {5, 6}};  // 行数可省略，列数不能省
```

遍历要用双层循环：

```c
for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
        printf("%d ", g[i][j]);
    }
    printf("\n");
}
```

内存里二维数组也是连续存放的，按行优先：`g[0][0] g[0][1] g[0][2] g[1][0] ...`

## 练习

1. 输入 10 个整数，输出最大值及其下标（如有多个取第一个）。
2. 用数组统计输入中每个数字（0~9）出现的次数。
3. 手写冒泡排序后，和 `qsort` 的行为对照（后者见函数篇）。
4. 二维数组实现两个矩阵相加。

下一篇：《字符串与字符数组》。
