class LazyMan {
    private name: string;
    private tasks: Function[] = []; // 任务列表
    constructor(name: string) {
        this.name = name;
        setTimeout(() => {
            // NOTE: 异步。等 next sleep 等操作注册完成之后再执行
            this.next();
        });
    }

    private next() {
        const task = this.tasks.shift(); // 取出当前 tasks 的第一个任务
        if (task) task();
    }
    eat(food: string) {
        const task = () => {
            console.info(`${this.name} eat ${food}`);
            this.next(); // 立刻执行下一个任务
        };
        this.tasks.push(task);
        return this; // 链式调用
    }
    sleep(seconds: number) {
        const task = () => {
            console.info(`${this.name} 开始睡觉`);
            setTimeout(() => {
                console.info(
                    `${this.name} 已经睡完了 ${seconds}s，开始执行下一个任务`
                );
                this.next(); // xx s 之后再执行下一个任务
            }, seconds * 1000);
        };
        this.tasks.push(task);
        return this;
    }
}

const me = new LazyMan('张雅昕');
me.eat('苹果')
    .eat('香蕉')
    .sleep(2)
    .eat('葡萄')
    .eat('西瓜')
    .sleep(2)
    .eat('橘子');
