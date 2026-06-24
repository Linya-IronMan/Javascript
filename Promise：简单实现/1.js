class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    state = myPromise.PENDING;
    result = null;
    reason = null;

    onFulfilledCallbacks = [];
    onRejectedCallbacks = [];

    constructor(executor) {
        this.state = myPromise.PENDING;

        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    resolve(result) {
        if (this.state == myPromise.PENDING) {
            this.result = result;
            this.state = myPromise.FULFILLED;
            this.onFulfilledCallbacks.forEach(callback => callback(result));
        }
    }
    reject(reason) {
        this.reason = reason;
        if (this.state == myPromise.PENDING) {
            this.state = myPromise.REJECTED;
            this.onRejectedCallbacks.forEach(callback => callback(reason));
        }
    }

    // NOTE: then 中"回调函数"返回的类型
    //       1. 返回一个 promise 2 —— 会陷入死循环
    // const promise2 = p.then(data => promise2); —— 死循环
    // QUE：为什么 onFulfilled 的返回值是一个 promise2 就会陷入死循环？onFulfilled 的返回值没人接收啊
    //       2. 返回一个 A+ 规范 promise 对象
    //       3. 返回一个其他规范的 promise 对象
    //       4. 返回普通的值
    then(onFulfilled, onRejected) {
        // NOTE: 返回 promise2 为了链式调用
        let promise2 = new myPromise((resolve, reject) => {
            // NOTE: 容错处理。不是函数类型的时候，直接返回值
            // onFulfilled =
            //     typeof onFulfilled == 'function' ? onFulfilled : value => value;
            // onRejected =
            //     typeof onRejected == 'function'
            //         ? onRejected
            //         : reason => {
            //               throw reason;
            //           };
            if (this.state == myPromise.FULFILLED) {
                // NOTE: 变更为宏任务，异步执行 then 中的回调。原生 promise 中是变更为微任务
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolve(this.result);
                        } else {
                            let x = onFulfilled(this.result);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.state == myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            reject(this.reason);
                        } else {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.state == myPromise.PENDING) {
                // NOTE: promise 中的回调与 then 中的回调都异步执行，无法保证执行顺序。
                //       存在可能：状态还是 pending 的时候就执行了 then方法
                //       本身 new promise().then(() => {}) 就会在创建完 promise 实例之后执行 then 方法。现在要将处于 pending 时候的 then 执行，押后
                //       在 resolve 的时候执行所有 fulfilledcallback ; reject 中执行所有 rejectedcallback
                this.onFulfilledCallbacks.push(() => {
                    // NOTE: 此处的 settimeout 也是为了让then的回调异步执行
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolve(this.result);
                        } else {
                            let x = onFulfilled(this.result);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onRejected !== 'function') {
                                reject(this.reason);
                            } else {
                                let x = onRejected(this.reason);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });
        return promise2;
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    // NOTE: 如果指向同一个对象，就会陷入死循环
    if (x === promise2) {
        throw new TypeError('promise error');
    }
    // NOTE: 是否是符合 A+规范的 Promise
    else if (x instanceof myPromise) {
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject);
        }, reject);
    }
    // NOTE: 是否符合其他规范的 promise
    // 1. x 是否为对象或函数
    // 2. x.then 是否为函数
    else if (x !== null && (typeof x === 'object' || typeof x == 'function')) {
        try {
            let then = x.then;
        } catch (e) {
            return reject(e);
        }

        if (typeof then === 'function') {
            try {
                then.call(
                    x,
                    y => {
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    r => {
                        reject(r);
                    }
                );
            } catch (e) {}
        }
    }
}
