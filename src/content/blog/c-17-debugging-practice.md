---
title: C 语言学习笔记（十七）：常见错误、调试与综合练习
description: 系列完结篇：编译与运行错误的排查方法、GDB 入门、防御性编程习惯，以及一份覆盖全课程的期末综合练习清单。
pubDate: 2026-09-17
tags: ['C语言', '学习笔记']
draft: false
series: 'C 语言学习笔记'
---

学到这里，语法基本都见过了。最后一篇讲两件实用的事：出错怎么办，以及怎么检验自己学会了。

## 编译时：把警告当错误看

编译时打开全套警告：

```bash
gcc main.c -o main -std=c11 -Wall -Wextra -g
```

- `-Wall -Wextra`：打开常用警告，能提前发现未初始化、类型不匹配等问题。
- `-std=c11`：指定标准，避免依赖编译器扩展。
- `-g`：生成调试信息，给 GDB 用。

**警告不是噪音，是编译器在帮你找 bug。**

### 常见编译错误

| 报错关键词 | 含义 | 常见原因 |
| --- | --- | --- |
| `expected ';'` | 缺分号 | 看上一行行尾 |
| `undeclared identifier` | 变量没声明 | 拼写错误 / 作用域不对 |
| `implicit declaration of function` | 函数没声明 | 没 include 头文件 |
| `expected declaration` | 语句写在了函数外 | 检查大括号配对 |
| `too few arguments` | 参数个数不对 | 对照函数原型 |
| `undefined reference` | 链接错误 | 函数只有声明没有实现 / 忘加源文件或 `-lm` |

链接错误和编译错误要分开看：**`undefined reference` 是链接阶段**，说明函数声明有、实现没找到。

### 常见运行错误

| 现象 | 可能原因 |
| --- | --- |
| Segmentation fault | 空指针/野指针解引用、数组越界、栈溢出（递归太深） |
| 结果随机变化 | 变量未初始化、越界写了别人的内存 |
| 死循环 | 循环变量不更新、scanf 缓冲区问题 |
| 输出乱码 | 字符数组没 `'\0'`、编码不一致 |
| 程序卡住 | 等待输入、feof 用法错误 |

## 调试利器：printf 与断言

最快的方法是「打印中间结果」：

```c
printf("[debug] i=%d, sum=%d\n", i, sum);
```

断言适合检查「本不该发生」的情况：

```c
#include <assert.h>

int divide(int a, int b) {
    assert(b != 0);     // 关掉调试（NDEBUG）后不产生开销
    return a / b;
}
```

## GDB 快速入门

编译时加 `-g`，然后启动：

```bash
gcc -g main.c -o main
gdb ./main
```

最常用命令：

| 命令 | 作用 |
| --- | --- |
| `run` | 运行程序 |
| `break main` / `break 文件名:行号` | 设置断点 |
| `next` | 单步执行，不进函数 |
| `step` | 单步执行，进函数 |
| `print 变量` | 查看变量值 |
| `continue` | 继续到下一个断点 |
| `backtrace` | 看调用栈，崩溃时定位现场 |
| `quit` | 退出 |

崩溃时先在 GDB 里 `run`，崩了立刻 `backtrace`，能直接看到出错的函数和行号，比盲目猜效率高得多。

## 防御性编程习惯

1. 变量声明时就初始化。
2. 指针用完置 NULL，解引用前判空。
3. 数组访问前检查下标范围。
4. 所有输入都当作「不可信」，检查 scanf 返回值。
5. 每个 malloc 记得对应的 free。
6. 函数参数用 `const` 修饰不改的指针。
7. 打开文件、分配内存后立刻检查失败。

这些习惯比记住多少语法更重要。

## 期末综合练习清单

按顺序做，能独立完成 8 题以上，这门课就稳了：

1. **水仙花数**：输出所有三位水仙花数（各位数字立方和等于自身）。
2. **素数统计**：输入 n，输出 1~n 中素数的个数与和。
3. **冒泡排序 + 二分查找**：生成随机数组，排序后查找指定值。
4. **字符串处理**：统计一行文本中单词数、最长单词、每个字母出现次数。
5. **矩阵运算**：实现矩阵转置、相加、相乘。
6. **学生成绩管理**：结构体数组 + 按成绩排序 + 及格率统计。
7. **递归专题**：阶乘、斐波那契、汉诺塔、全排列（选做）。
8. **动态内存**：实现一个输入未知个数的数组（realloc 扩容）。
9. **文件版通讯录**：姓名+电话存文件，支持增删查改。
10. **综合项目**：简易计算器 / 猜数字游戏 / 学生管理系统（命令行菜单）。

### 参考：水仙花数

```c
#include <stdio.h>

int main(void) {
    for (int n = 100; n <= 999; n++) {
        int a = n / 100;
        int b = n / 10 % 10;
        int c = n % 10;
        if (a * a * a + b * b * b + c * c * c == n) {
            printf("%d ", n);
        }
    }
    return 0;
}
```

### 参考：猜数字核心逻辑

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    srand((unsigned)time(NULL));
    int answer = rand() % 100 + 1;
    int guess, tries = 0;

    do {
        printf("猜一个 1~100 的数：");
        if (scanf("%d", &guess) != 1) {
            while (getchar() != '\n');   // 清掉非法输入
            continue;
        }
        tries++;
        if (guess > answer) printf("大了\n");
        else if (guess < answer) printf("小了\n");
    } while (guess != answer);

    printf("猜对了！共 %d 次\n", tries);
    return 0;
}
```

## 写在最后

C 语言的学习曲线集中在指针和内存这两块，绕不过去，但也不需要天赋，只需要「写—编译—改错」的循环。这份笔记里的每个例子都实际编译运行过，建议你也逐条敲一遍。

接下来可以往数据结构（链表、栈、队列、树）和算法方向走，那时你会发现，C 语言只是工具，真正的内功是数据怎么组织、问题怎么拆解。

系列完。祝学习顺利。
