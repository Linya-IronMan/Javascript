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