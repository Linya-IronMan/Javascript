import './bind';
import './call_and_apply';

describe('自定义 bind', () => {
    it('绑定 this', () => {
        function fn(this: any) {
            return this;
        }
        // @ts-ignore
        const fn1 = fn.customBind({ x: 100 });
        expect(fn1()).toEqual({ x: 100 });
    });

    it('绑定参数', () => {
        function fn(a: number, b: number, c: number) {
            return a + b + c;
        }

        //@ts-ignore
        const fn1 = fn.customBind(null, 10, 20);
        expect(fn1(30)).toBe(10 + 20 + 30);
    });
});

describe('自定义call', () => {
    it('绑定 this - 对象', () => {
        function fn(this: any) {
            return this;
        }

        // @ts-ignore
        const res = fn.customCall({ x: 100 });
        expect(res).toEqual({ x: 100 });
    });

    it('绑定this - 值类型', () => {
        function fn(this: any) {
            return this;
        }
        //@ts-ignore
        const res = fn.customCall('abc');
        expect(res.toString()).toBe('abc');

        // @ts-ignore
        const res1 = fn.customCall(null);
        expect(res1).not.toBeNull();
    });

    it('绑定参数', () => {
        function fn(a: number, b: number) {
            return a + b;
        }
        // @ts-ignore
        const res = fn.customCall(null, 10, 20);
        expect(res).toBe(30);
    });
});

describe('自定义Apply', () => {
    it('绑定 this - 对象', () => {
        function fn(this: any) {
            return this;
        }

        // @ts-ignore
        const res = fn.customApply({ x: 100 });
        expect(res).toEqual({ x: 100 });
    });

    it('绑定this - 值类型', () => {
        function fn(this: any) {
            return this;
        }
        //@ts-ignore
        const res = fn.customApply('abc');
        expect(res.toString()).toBe('abc');

        // @ts-ignore
        const res1 = fn.customApply(null);
        expect(res1).not.toBeNull();
    });

    it('绑定参数', () => {
        function fn(a: number, b: number) {
            return a + b;
        }
        // @ts-ignore
        const res = fn.customApply(null, [10, 20]);
        expect(res).toBe(30);
    });
});
