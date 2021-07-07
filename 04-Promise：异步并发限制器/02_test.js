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