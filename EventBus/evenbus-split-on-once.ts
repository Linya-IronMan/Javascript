// @ts-ignore
export class EventBus {
    private events: { [key: string]: Array<Function> };
    private onceEvents: { [key: string]: Array<Function> };

    constructor() {
        this.events = {};
        this.onceEvents = {};
    }

    on(type: string, fn: Function) {
        const events = this.events;
        if (!events[type]) events[type] = [];
        events[type].push(fn);
    }

    once(type: string, fn: Function) {
        const onceEvents = this.onceEvents;
        if (!onceEvents[type]) onceEvents[type] = [];
        onceEvents[type].push(fn);
    }

    off(type: string, fn?: Function) {
        if (!fn) {
            this.events[type] = [];
            this.onceEvents[type] = [];
        } else {
            const fnList = this.events[type];
            const onceList = this.onceEvents[type];
            if (fnList) {
                this.events[type] = fnList.filter(curFn => curFn != fn);
            }
            if (onceList) {
                this.onceEvents[type] = onceList.filter(curFn => curFn != fn);
            }
        }
    }

    emit(type: string, ...args: any[]) {
        const fnList = this.events[type];
        const onceFnList = this.onceEvents[type];

        if (fnList) {
            fnList.forEach(f => f(...args));
        }

        if (onceFnList) {
            onceFnList.forEach(f => f(...args));

            this.onceEvents[type] = [];
        }
    }
}
