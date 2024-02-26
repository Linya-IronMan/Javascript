// @ts-ignore
export class EventBus {
    /**
     * {
     *   事件有序
     *  key1: [
     *     {fn : fn1, isOnce: false}
     *  ]
     * }
     */

    private events: {
        [key: string]: Array<{ fn: Function; isOnce: boolean }>;
    };

    constructor() {
        this.events = {};
    }

    on(type: string, fn: Function, isOnce: boolean = false) {
        const events = this.events;
        if (events[type] == null) {
            events[type] = [];
        }

        events[type].push({ fn, isOnce });
    }
    once(type: string, fn: Function) {
        this.on(type, fn, true);
    }
    off(type: string, fn?: Function) {
        if (!fn) {
            // NOTE: 解绑所有函数
            this.events[type] = [];
        } else {
            const fnList = this.events[type];
            if (fnList) {
                this.events[type] = fnList.filter(item => item.fn !== fn);
            }
        }
    }

    emit(type: string, ...args) {
        const fnList = this.events[type];
        if (!fnList) return;

        this.events[type] = fnList.filter(item => {
            const { fn, isOnce } = item;
            fn(...args);
            // 配合filter 将 once 函数删除掉
            if (!isOnce) return true;
            return false;
        });
    }
}
