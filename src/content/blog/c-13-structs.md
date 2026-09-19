---
title: C 语言学习笔记（十三）：结构体、共用体与枚举
description: 用结构体把相关数据打包成一个整体：定义、初始化、结构体数组、结构体指针与 -> 运算符，附共用体、枚举与 typedef 的用法。
pubDate: 2026-09-09
tags: ['C语言', '学习笔记']
draft: false
---

数组要求元素同类型。要描述一个「学生」（姓名 + 学号 + 成绩），就需要结构体。

## 定义与使用

```c
#include <stdio.h>
#include <string.h>

struct Student {
    char name[20];
    int id;
    double score;
};

int main(void) {
    struct Student s1;               // 声明结构体变量
    strcpy(s1.name, "小明");          // 字符数组不能直接赋值，用 strcpy
    s1.id = 20260001;
    s1.score = 92.5;

    printf("%s %d %.1f\n", s1.name, s1.id, s1.score);

    struct Student s2 = {"小红", 20260002, 88.0};  // 按顺序初始化
    return 0;
}
```

`struct Student` 是类型名，`s1` 是变量名。成员用 `.` 访问。

## typedef：给类型起别名

每次都写 `struct Student` 太啰嗦：

```c
typedef struct Student {
    char name[20];
    int id;
    double score;
} Student;      // 现在可以直接用 Student

Student s = {"小明", 20260001, 92.5};
```

这是工程中最常见的写法。

## 结构体数组

```c
Student class1[3] = {
    {"小明", 20260001, 92.5},
    {"小红", 20260002, 88.0},
    {"小刚", 20260003, 76.5},
};

double sum = 0;
for (int i = 0; i < 3; i++) {
    sum += class1[i].score;
}
printf("平均分 %.1f\n", sum / 3);
```

## 结构体指针与 ->

指向结构体的指针，用 `->` 访问成员：

```c
Student s = {"小明", 20260001, 92.5};
Student *p = &s;

printf("%s\n", (*p).name);   // 先解引用再取成员
printf("%s\n", p->name);     // 等价写法，常用
```

`p->name` 就是 `(*p).name` 的语法糖。指针传参给结构体函数时最常用：

```c
void print_student(const Student *s) {
    printf("%s %d %.1f\n", s->name, s->id, s->score);
}
```

加 `const` 表示函数不会修改结构体内容，是好的工程习惯。

## 结构体做函数参数：值传递 vs 指针

```c
void modify_copy(Student s) { s.score = 100; }        // 改的是副本
void modify_real(Student *s) { s->score = 100; }      // 改的是本体
```

结构体可能很大，**推荐传指针**：避免拷贝开销，也能修改原数据。

## 结构体嵌套

```c
typedef struct {
    int year, month, day;
} Date;

typedef struct {
    char name[20];
    Date birthday;
} Person;

Person p = {"小明", {2008, 5, 20}};
printf("%d\n", p.birthday.year);
```

## 内存对齐（了解）

```c
struct A { char c; int i; };
printf("%zu\n", sizeof(struct A));   // 通常是 8，不是 5
```

编译器会在成员之间插入填充字节，保证访问效率。初学阶段知道「结构体大小可能大于成员之和」即可；网络传输、文件存储场景要精确控制时再深入。

## 共用体 union

所有成员共享同一块内存，同一时间只能有效存一个：

```c
union Value {
    int i;
    float f;
    char bytes[4];
};

union Value v;
v.i = 0x41424344;
printf("%c\n", v.bytes[0]);   // 观察内存布局（小端序）
```

## 枚举 enum

给整数常量起名字，提高可读性：

```c
typedef enum {
    MON = 1, TUE, WED, THU, FRI, SAT, SUN
} Weekday;

Weekday today = WED;
printf("%d\n", today);   // 3
```

默认从 0 开始递增，也可以像上面一样指定起点。`switch` 枚举时编译器能帮忙做检查的场合更多。

## 练习

1. 定义「图书」结构体（书名、作者、价格），输入 3 本书找出最贵的一本。
2. 给第 8 篇的冒泡排序写一个结构体版本，按成绩排序学生数组。
3. 用结构体指针改写「打印学生信息」函数，并用 `const` 修饰参数。
4. 用枚举表示石头剪刀布，写一个双人对战的小程序。

下一篇：《预处理与多文件编程》。
