class Scheduler {
    limit = 0
    concurrence = 0
    queue = []

    constructor(limit) {
        this.limit = limit
    }

    add(promiseCreator, order) {
        // NOTE: 此promise作为任务的启动器
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res
            reject = rej
        })


        // NOTE：此promise作为任务的结束器，返回到函数外部
        let returnValue = {}
        returnValue.promise = new Promise((rs, rj) => {
            returnValue.resolve = rs
            returnValue.reject = rj
        })

        // NOTE: 任务启动之后执行任务，
        promise.then(() => promiseCreator()).finally(() => {
            returnValue.resolve()
            this.concurrence--
            if (this.queue.length) {
                if (this.concurrence < this.limit) {
                    const { resolve } = this.queue.shift()
                    this.concurrence++
                    // 启动下一个任务
                    resolve()
                }
            }
        })


        if (this.concurrence < this.limit) {
            this.concurrence++
            resolve()
        } else {
            this.queue.push({ promise, resolve, reject, order })
        }

        return returnValue.promise
    }
}

const timeout = time => new Promise(resolve => setTimeout(resolve, time))

const parallelCount = 2
const scheduler = new Scheduler(parallelCount)

const addTask = (time, order) => {
    scheduler.add(() => timeout(time), order).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// 并发数量：3，输出结果：3241
// 并发数量：2，输出结果：2314

