// import { EventBus } from './eventbus';
import { EventBus } from './evenbus-split-on-once';
describe('EventBus 自定义事件', () => {
    it('绑定事件，触发事件', () => {
        const event = new EventBus();

        // NOTE: 注意：不能直接 function() {} 定义函数
        const fn1 = jest.fn(); // jest mock function
        const fn2 = jest.fn();
        const fn3 = jest.fn();

        event.on('key1', fn1);
        event.on('key1', fn2);
        event.on('xxx', fn3);

        event.emit('key1', 10, 20);

        expect(fn1).toHaveBeenCalledWith(10, 20);
        expect(fn2).toHaveBeenCalledWith(10, 20);
        expect(fn3).not.toHaveBeenCalledWith(10, 20);
    });

    it('解绑单个事件', () => {
        const event = new EventBus();

        const fn1 = jest.fn(); // jest mock function
        const fn2 = jest.fn();

        event.on('key1', fn1);
        event.on('key1', fn2);

        event.off('key1', fn1);

        event.emit('key1', 10, 20);
        expect(fn1).not.toHaveBeenCalledWith(10, 20);
        expect(fn2).toHaveBeenCalledWith(10, 20);
    });

    it('解绑所有事件', () => {
        const event = new EventBus();

        const fn1 = jest.fn(); // jest mock function
        const fn2 = jest.fn();

        event.on('key1', fn1);
        event.on('key1', fn2);

        event.off('key1');

        expect(fn1).not.toHaveBeenCalledWith();
        expect(fn2).not.toHaveBeenCalledWith(10, 20);
    });

    it('once', () => {
        const event = new EventBus();

        let n = 1;

        const fn1 = jest.fn(() => n++); // jest mock function
        const fn2 = jest.fn(() => n++);

        event.once('key1', fn1);
        event.once('key1', fn2);

        event.emit('key1');
        event.emit('key1');
        event.emit('key1');
        event.emit('key1');
        event.emit('key1');

        expect(n).toBe(3);

        // NOTE: 第二次就不会再触发, 已经触发了一次，后续会永远处于触发状态
        // event.emit('key1', 10, 20);
        // expect(fn1).not.toHaveBeenCalledWith();
        // expect(fn2).not.toHaveBeenCalledWith(10, 20);
    });
});
