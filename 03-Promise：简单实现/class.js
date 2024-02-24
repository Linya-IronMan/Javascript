const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
    // NOTE: 加上 # 定义的属性是什么含义？ 私有属性是干什么的？ 共有呢？
    state = PENDING;
    value = undefined;
    reason = undefined;

    onResolvedCallbacks = [];
    onRejectedCallbacks = [];

    constructor(executor) {
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (err) {
            this.reject(err);
        }
        // NOTE: 如果没有主动返回值，则以实例为返回值
    }
    resolve(value) {
        if (this.state == PENDING) {
            this.state = FULFILLED;
            this.value = value;
            this.onResolvedCallbacks.forEach(fn => fn());
        }
    }

    reject(reason) {
        if (this.state == PENDING) {
            this.state = RESOVLED;
            this.reason = reason;
            this.onRejectedCallbacks.forEach(fn => fn());
        }
    }

    then(onFulFilled, onRejected) {
        // NOTE: 这是在干什么？
        if (typeof onFulFilled != 'function') onFulFilled = value => value;
        if (typeof onRejected != 'function') onRejected = reason => reason;

        let promise = new MyPromise((resolve, reject) => {
            if (this.state == FULFILLED) {
                setTimeout(() => {});
                onFulFilled(this.value);
            }

            if (this.state == REJECTED) {
                onRejected(this.reason);
            }

            if (this.state == PENDING) {
                this.onResolvedCallbacks.push(() => onFulFilled(this.value));
                this.onRejectedCallbacks.push(() => onRejected(this.reason));
            }
        });
    }
}

let p = new MyPromise((resolve, reject) => {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        resolve('1000 timer');
    }, 1000);
});

p.then(msg => {
    console.log('Hello World!', msg);
    return '199999 timer';
}).then(msg => {
    console.log('2rd msg', msg);
});
