

class Scheduler {

    count = 0;
    queue = [];
    maxCount = 2;

    constructor() {
    }

    add(promiseCreater) {
        let _resolve;
        
        const doNext = () => {
            // 队列中存在任务，并且当前正在执行的任务数量小于最大值
            if (this.queue.length && this.count < this.maxCount) {
                this.count++;
                this.queue.shift()().then(() => {
                    // 任务执行结束，输出结果
                    debugger
                    _resolve(123); // 存在 resolve之后没有输出的情况
                    debugger
                    this.count--;
                    doNext();
                })
            }
        }        

        doNext();

        return new Promise((resolve) => {
            _resolve = resolve;
        })
    }
}


const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then((data) => console.log(order, data))
}
addTask(3000, '1')
addTask(1000, '2')
addTask(4000, '3')
addTask(4000, '4')
// 结果： 2 3 1 4