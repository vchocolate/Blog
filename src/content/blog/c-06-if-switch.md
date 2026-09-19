---
title: C 语言学习笔记（六）：选择结构 if 与 switch
description: 条件判断的两种写法：if/else 与 switch/case，重点讲等号陷阱、大括号省略、case 穿透与适用场景。
pubDate: 2026-08-26
tags: ['C语言', '学习笔记']
draft: false
series: 'C 语言学习笔记'
---

程序要做判断，就有了选择结构。这一篇讲两种判断写法。

## if 的基本形式

```c
if (条件) {
    // 条件为真时执行
}
```

```c
if (score >= 60) {
    printf("及格\n");
} else {
    printf("不及格\n");
}
```

多分支：

```c
if (score >= 90) {
    printf("优秀\n");
} else if (score >= 80) {
    printf("良好\n");
} else if (score >= 60) {
    printf("及格\n");
} else {
    printf("不及格\n");
}
```

**从上到下依次判断，命中一个就跳出**。所以条件顺序很重要，上面例子里不能把 `>= 60` 放最前。

## 三个高频错误

### 错误一：把 == 写成 =

```c
if (score = 60) {   // 恒为真！这是赋值，结果是 60，非零即真
    ...
}

if (60 == score) {  // 用常量在左边，写错成 = 会直接编译报错
```

推荐把常量写左边，让编译器帮你抓错。

### 错误二：省略大括号

```c
if (score >= 60)
    printf("及格\n");
    printf("恭喜\n");   // 这行不受 if 控制，永远执行！
```

初学阶段**一律加大括号**，别省。

### 错误三：条件表达式写错

```c
if (60 <= score <= 100) { }   // 错！等价于 (60<=score)<=100，恒真
if (score >= 60 && score <= 100) { }  // 对
```

## switch：多等值分支

适合「判断一个变量等于几个固定值」的场景：

```c
#include <stdio.h>

int main(void) {
    char op;
    double a, b;
    scanf("%lf %c %lf", &a, &op, &b);

    switch (op) {
        case '+':
            printf("%.2f\n", a + b);
            break;
        case '-':
            printf("%.2f\n", a - b);
            break;
        case '*':
            printf("%.2f\n", a * b);
            break;
        case '/':
            if (b != 0)
                printf("%.2f\n", a / b);
            else
                printf("除数不能为 0\n");
            break;
        default:
            printf("不支持的运算符\n");
    }
    return 0;
}
```

要点：

- `switch` 的判断值必须是**整型或字符**（不能是浮点、字符串）。
- `case` 后面必须是**常量**，不能是变量。
- **每个 case 记得加 `break`**，否则会「穿透」执行下一个 case。

### 穿透什么时候有用

多个值执行同一段代码时：

```c
switch (grade) {
    case 'A':
    case 'B':
        printf("优秀\n");
        break;
    default:
        printf("继续加油\n");
}
```

这是有意利用穿透，注释写清楚，避免被当成 bug。

## if 还是 switch

| 场景 | 推荐 |
| --- | --- |
| 范围判断（分数段、大小比较） | if |
| 等值判断（菜单、运算符） | switch |
| 条件是复杂表达式 | if |
| 分支很多且都是固定值 | switch（更清晰） |

## 练习

1. 判断闰年：能被 4 整除但不能被 100 整除，或者能被 400 整除。
2. 输入成绩输出等级，用 if 和 switch 各写一遍（switch 用 `score / 10`）。
3. 写一个简单计算器，支持四则运算与除零判断。

下一篇：《循环结构：while、do-while、for》。
