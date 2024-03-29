import { curry } from './_curry';

describe('curry', () => {
    it('add', () => {
        function add(a: number, b: number, c: number) {
            return a + b + c;
        }
        const res1 = add(10, 20, 30);
        const curryAdd = curry(add);
        const res2 = curryAdd(10)(20)(30);
        expect(res1).toBe(res2);
    });
});
