---
title: C 语言学习笔记（九）：字符串与字符数组
description: C 字符串的本质是 '\0' 结尾的字符数组，讲清初始化方式、string.h 常用函数、fgets 安全输入，以及为何不要用 gets。
pubDate: 2026-09-01
tags: ['C语言', '学习笔记']
draft: false
---

C 语言没有专门的字符串类型，字符串就是「以 `'\0'` 结尾的字符数组」。

## 字符串的两种写法

```c
char s1[] = "hello";        // 字符数组：可修改，占 6 字节（含 '\0'）
char *s2 = "hello";         // 指向字符串常量：内容不可修改
const char *s3 = "hello";   // 推荐写法，明确表示只读
```

`"hello"` 有 5 个字符，但存储需要 6 字节，最后是结束标志 `'\0'`（ASCII 0）：

```text
下标:  0    1    2    3    4    5
内容: 'h'  'e'  'l'  'l'  'o'  '\0'
```

**所有字符串处理都以 `'\0'` 为准**，没有它就不是合法字符串，`printf("%s")` 会一直往后读直到撞见 0，属于未定义行为。

## 初始化与输入输出

```c
char a[20] = "hello";
char b[20] = {'h', 'e', 'l', 'l', 'o', '\0'};  // 等价，别忘 '\0'
char c[20];

printf("%s\n", a);        // 输出到 '\0' 为止
puts(a);                  // 输出并自动换行
```

输入：

```c
char name[20];
scanf("%19s", name);      // 不能读空格；19 是安全上限（留 '\0' 的位置）
fgets(name, sizeof(name), stdin);  // 可以读含空格的一整行，推荐
```

`fgets` 会把换行符也读进来，不需要时可以去掉：

```c
name[strcspn(name, "\n")] = '\0';
```

## 千万不要用 gets

`gets` 不检查长度，输入超长会覆盖相邻内存，是经典安全漏洞，C11 标准已经移除。老师若还在用，知道怎么回事即可，自己写代码用 `fgets`。

## string.h 常用函数

需要 `#include <string.h>`。

| 函数 | 作用 | 说明 |
| --- | --- | --- |
| `strlen(s)` | 求长度 | 不含 `'\0'`，返回值 size_t |
| `strcpy(dst, src)` | 复制 | dst 必须够大，有溢出风险 |
| `strncpy(dst, src, n)` | 限定长度复制 | 更安全，但不保证结尾有 `'\0'` |
| `strcat(dst, src)` | 拼接 | 同样注意 dst 容量 |
| `strcmp(a, b)` | 比较 | 相等返回 0，a>b 返回正数，a<b 返回负数 |
| `strchr(s, c)` | 查找字符 | 返回首次出现的指针 |
| `strstr(s, sub)` | 查找子串 | 返回位置指针 |

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[20] = "hello";
    char b[20] = "world";

    printf("len = %zu\n", strlen(a));        // 5
    strcat(a, " ");                           // a = "hello "
    strcat(a, b);                             // a = "hello world"
    printf("%s\n", a);

    if (strcmp("abc", "abd") < 0) {
        printf("abc 在字典序里更小\n");
    }
    return 0;
}
```

**字符串不能用 `==` 比较**：

```c
char a[] = "hi", b[] = "hi";
if (a == b) { }              // 错！比较的是两个数组的地址
if (strcmp(a, b) == 0) { }   // 对
```

## 常见字符串操作

统计字符类型：

```c
#include <stdio.h>
#include <ctype.h>

int main(void) {
    char s[100];
    fgets(s, sizeof(s), stdin);

    int letters = 0, digits = 0, spaces = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        if (isalpha((unsigned char)s[i])) letters++;
        else if (isdigit((unsigned char)s[i])) digits++;
        else if (isspace((unsigned char)s[i])) spaces++;
    }

    printf("字母 %d 数字 %d 空白 %d\n", letters, digits, spaces);
    return 0;
}
```

`ctype.h` 里的 `isalpha/isdigit/isspace/toupper/tolower` 都比手写范围判断清晰。

## 练习

1. 输入一行英文，统计单词个数（连续非空白字符算一个单词）。
2. 实现 `strlen`、`strcmp` 的功能（不调用库函数）。
3. 判断回文字符串（如 "level"），忽略大小写。

下一篇：《函数：从模块化到递归》。
