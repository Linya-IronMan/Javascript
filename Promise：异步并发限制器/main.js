class Scheduler {
    constructor() {
        this.queue = []
        this.count = 0
    }
    add(promiseCreator) {
        let _resolve
        const tempFunc = () => {
            this.count++
            promiseCreator()
              .then(() => {
                _resolve()
                this.count--
                if (this.queue.length) {
                    this.queue.shift()()
                }
            })
        }
        if (this.count < 2 && this.queue.length === 0) {
            tempFunc()
        } else {
            this.queue.push(tempFunc)
        }

        return new Promise((resolve) => {
            _resolve = resolve
        })
    }
}

const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')