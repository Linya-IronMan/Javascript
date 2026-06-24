# 原生 Promise 基础用法

```javascript
let test = new Promise((resolve, reject) => {
    resolve("hello")
})

test.then((data) => {
    console.log(data)
})

console.log("world")
```

输出结果:`world hello`

# 自行实现

```javascript

class MyPromise {

    constructor() {

    }

}

```

---

问题一: 自行实现的 promise 代码在同步代码之前执行.
解决: 将 then 中的执行放在 `setTimeout(() => {}, 0)` 中执行.

---

问题二: 如下, 最后什么结果也没有输出
原因: resolve 代码是 1s 之后才执行的, 这个时候 test.then 方法已经执行过了

```javascript
    const test = new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve("hello world")
        }, 1000)
    })

    test.then(res => {
        console.log(res)
    })
```

`then` 方法执行的时候状态还是 `PENDING`, 什么也没有执行

```javascript
 then(onResolved, onRejected) {
        if (this.status === RESOLVE) {
            setTimeout(() => {
                onResolved(this.result);
            }, 0);
        }
        if (this.status === REJECT) {
            setTimeout(() => {
                onRejected(this.reason);
            }, 0);
        }
    }

```

解决: 使用一个发布订阅模式解决. 在状态属于 PENDING 的时候,将 then 中的方法存储起来, resolve 执行的时候再将方法推出执行.

注意: 此次推出执行的时候会将所有缓存的方法全部执行完毕

---

问题: 应该如何实现 Promise 的链式调用.
解决: 在调用 then 方法的时候返回一个新的 MyPromise 实例即可
