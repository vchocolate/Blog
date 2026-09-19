---
title: C 语言学习笔记（七）：循环结构 while、do-while、for
description: 三种循环的语法与选择，break 与 continue 的差别，循环嵌套，以及累加、素数、图形打印等经典练习。
pubDate: 2026-08-28
tags: ['C语言', '学习笔记']
draft: false
---

计算机最擅长做重复的事，循环就是让它不停干活的结构。

## while

先判断后执行，条件不满足一次都不执行：

```c
int i = 1;
int sum = 0;
while (i <= 100) {
    sum += i;
    i++;
}
printf("1+2+...+100 = %d\n", sum);
```

**注意**：循环变量要在里面变化，否则死循环。

## do-while

先执行一次，再判断。适合「至少要执行一次」的场景：

```c
int n;
do {
    printf("请输入 1~100 的数：");
    scanf("%d", &n);
} while (n < 1 || n > 100);   // 输入不合法就重来
```

while 和 do-while 的差别：`do-while` 至少执行一次。

## for

最常用的循环，三要素写在一行：

```c
for (初始化; 条件; 更新) {
    循环体;
}

for (int i = 1; i <= 100; i++) {
    sum += i;
}
```

执行顺序：初始化 → 判断条件 → 循环体 → 更新 → 再判断……条件为假时结束。

常见变体：

```c
for (;;) { }             // 死循环（等价 while(1)，靠 break 退出）
for (int i = 10; i > 0; i--) { }   // 倒着循环
for (int i = 0; i < n; i += 2) { } // 步长 2
```

## break 与 continue

```c
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;      // 整个循环立即结束
    printf("%d ", i);       // 输出 1 2 3 4
}

for (int i = 1; i <= 10; i++) {
    if (i == 5) continue;   // 跳过本次，继续下一次
    printf("%d ", i);       // 输出 1 2 3 4 6 7 8 9 10
}
```

- `break`：跳出**当前一层**循环。
- `continue`：结束本次迭代，进入下一次。

## 循环嵌套

```c
// 九九乘法表
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= i; j++) {
        printf("%d*%d=%-2d ", j, i, i * j);
    }
    printf("\n");
}
```

嵌套循环的内层跑完一轮，外层才走一步。打印图形全靠它：

```c
// 打印直角三角形
int n = 5;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        printf("*");
    }
    printf("\n");
}
```

## 经典练习：判断素数

```c
#include <stdio.h>
#include <math.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int is_prime = 1;
    if (n < 2) {
        is_prime = 0;
    } else {
        for (int i = 2; i <= (int)sqrt(n); i++) {
            if (n % i == 0) {
                is_prime = 0;
                break;     // 找到一个因子就够，提前退出
            }
        }
    }

    printf("%d %s素数\n", n, is_prime ? "是" : "不是");
    return 0;
}
```

用 `sqrt(n)` 作为上界，可以把判断次数从 n 降到 √n。GCC 编译时若提示找不到 `sqrt`，加 `-lm` 链接数学库：

```bash
gcc prime.c -o prime -lm
```

## 死循环排查清单

1. 循环变量有没有变化？
2. 条件方向是否写反（`i >= n` 还是 `i <= n`）？
3. 是否在循环体内误改了循环变量？
4. `scanf` 失败卡在缓冲区（见第五篇陷阱二）？

## 练习

1. 求 n!（n 由键盘输入），验证 13! 之后用 int 会怎样。
2. 输出 100~200 之间所有素数。
3. 打印倒三角形与菱形图案。
4. 输入一个整数，判断它各位数字之和。

下一篇：《数组：一维与二维》。
