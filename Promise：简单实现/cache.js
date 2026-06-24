const RESOLVE = 'resolved';
const REJECT = 'rejected';
const PENDING = 'pending';

class JJPromise {
    status = PENDING;
    result = undefined;
    reason = undefined;
    onResolvedArr = [];
    onRejectedArr = [];

    constructor(excution) {
        const resolve = result => {
            if (this.status === PENDING) {
                this.result = result;
                this.status = RESOLVE;
                this.onResolvedArr.map(fn => fn());
            }
        };
        const reject = reason => {
            if (this.status === PENDING) {
                this.result = reason;
                this.status = REJECT;
                this.onRejectedArr.map(fn => fn());
            }
        };

        excution(resolve, reject);
    }

    then(onResolved, onRejected) {
        const newPromise = new JJPromise((resolve, reject) => {
            if (this.status === RESOLVE) {
                setTimeout(() => {
                    resolve(onResolved(this.result));
                }, 0);
            }
            if (this.status === REJECT) {
                setTimeout(() => {
                    reject(onRejected(this.reason));
                }, 0);
            }

            if (this.status === PENDING) {
                this.onResolvedArr.push(() => resolve(onResolved(this.result)));
                this.onRejectedArr.push(() => reject(onRejected(this.reason)));
            }
        });
        return newPromise;
    }
}

const test = new JJPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello');
    }, 1000);
});

test.then(
    res => {
        console.log(res, 'then 1');
        return 2222;
    },
    err => {}
)
    .then(data => {
        setTimeout(() => {
            console.log(data, 'then 2');
            return new JJPromise(resolve => resolve(23123));
        }, 1000);
    })
    .then(d => {
        console.log(d, 'then 3');
    });

// const test = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(123);
//     }, 1000);
// });

// test.then(d => {
//     console.log(d, 'then 1');
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(321);
//         }, 2000);
//     });
// }).then(d => {
//     console.log(d, 'then 2');
// });

console.log('world');
