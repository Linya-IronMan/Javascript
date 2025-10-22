class Scheduler {
  count = 0;
  queue = [];
  maxCount = 2;

  constructor() {}

  add(promiseCreater) {
    const doNext = () => {
      if (this.queue.length && this.cocunt < this.maxCount) {
        this.queue.shift()();
        this.count++
      }
    }

    if (this.count < this.maxCount) {
      return new Promise((resolve) => {
        this.count++;
        promiseCreater().then(() => {
          resolve(123);
          this.count--;
          doNext();
        })
      })
    }

    return new Promise((resolve) => {
      this.queue.push(() => {
        this.count++;
        promiseCreater().then(() => {
          resolve()
          this.count--;
          doNext();
        })
      })
    });
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then((data) => console.log(order, data));
};
addTask(3000, "1");
addTask(1000, "2");
addTask(4000, "3");
addTask(4000, "4");
// 结果： 2 3 1 4
