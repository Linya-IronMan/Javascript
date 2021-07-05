class Scheduler {
  constructor() {
    this.count = 0
    this.queue = []
  }
  add(promiseCreator){
    this.queue.push(promiseCreator)  
    return this.runTask()  
  }

  runTask() {
    if (this.count < 2) {
      let curCreator = this.queue.shift()
      this.count++
      curCreator().then(() => {
        this.count--
        this.runTask()
        return Promise.resolve()
      })
    }
  }
  // ...
}
  
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler()
const addTask = (time, order) => {
  // 会在time 之后resolve。  =》 通过接收这个resolve入队列
  // 并没有， 当我们执行这个回调 并向执行结果添加then的时候 里面的内容已经执行完毕了
  // 没错 虽然 下面回调中没有resolve 但是仍可以添加then 并且then 会在回调中的then之后执行
  // 问题：再次添加的then在EventLoop处于什么地位？执行顺序？
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

