# Promise 异步并发限制器
复习的时候，发现了这道题的一种简单版本，这里将两个版本都实现一下

困难版本的 `scheduler.add` 存在一个 `promise` 的返回值


**简单版本：**
```javascript
const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)));
}

```
---
**困难版本：**
```javascript
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(()=>console.log(order))
}

```

## 题目描述：hard
```javascript
class Scheduler {
  add(promiseCreator){...}
  // ...
}
  
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(()=>console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output: 2 3 1 4
// 一开始，1、2两个任务进入队列
// 500ms 时，2完成，输出2，任务3进队
// 800ms 时，3完成，输出3，任务4进队
// 1000ms 时，1完成，输出1
```

**问题**

- 什么时候向任务队列中添加任务（需要对当前正在执行的任务数量进行判断）
  - 需要在执行时间到了之后再入队列
- 任务如何从队列中弹出（大概是执行完成之后进行操作）

## 题目描述：simple
```javascript
class Scheduler {
  add(promiseCreator){...}
  // ...
}
  
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)));
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output: 2 3 1 4
// 一开始，1、2两个任务进入队列
// 500ms 时，2完成，输出2，任务3进队
// 800ms 时，3完成，输出3，任务4进队
// 1000ms 时，1完成，输出1
```

**题解：**

```javascript
class Scheduler {
    constructor(maxCount) {
        this.count = 0;
        this.queue = [];
        this.maxCount = maxCount;
    }
    add(promiseCreater) {
        this.queue.push(promiseCreater);
    }

    // 问题：什么时候执行start方法？
    start() {
        // 开始的时候需要maxCount个任务执行
        for (let i =0; i < this.maxCount; i++) {
            this.doNext();
        }
    }

    doNext() {
        if (this.queue.length && this.count < this.maxCount) {
            this.count ++;
            this.queue.shift()().then(() => {
                this.count--;
                this.doNext();
            })
        }
    }
}


const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler(2)
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)));
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// 结果： 2 3 1 4

scheduler.start();
```

并不喜欢这种写法，因为做了很多妥协，与实际情况脱节。

`start`方法是在任务添加完毕之后，手动执行。而在我的预想中，任务的添加和执行应当是一个动态的过程。随时添加，随时执行。

像上面的解决方案，如果存在任务依赖于一个异步IO执行结果，难道所有任务都需要等到IO执行完毕之后再 start 么？

