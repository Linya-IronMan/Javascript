import cloneDeep from './_deepclone';

describe('深拷贝', () => {
    it('值类型 & null', () => {
        expect(cloneDeep(100)).toBe(100);
        expect(cloneDeep('abc')).toBe('abc');
        expect(cloneDeep(null)).toBe(null);
    });

    it('普通对象和数组', () => {
        const obj = {
            name: '张雅欣',
            info: {
                city: '北京',
            },
            arr: [10, 20, 30],
        };

        const obj1 = cloneDeep(obj);
        obj.info.city = '上海';

        expect(obj1.info.city).toBe('北京');
        expect(obj1.arr).toEqual([10, 20, 30]);
        expect(obj1.info.city).toBe('北京');
    });

    it('Map', () => {
        const m1 = new Map([
            ['x', 10],
            ['y', 20],
        ]);
        const m2 = cloneDeep(m1);
        expect(m2.size).toBe(2);

        const obj = {
            map: new Map([
                ['x', 10],
                ['y', 20],
            ]),
        };
        const obj1 = cloneDeep(obj);
        expect(obj1.map.size).toBe(2);
    });
    it('Set', () => {
        const s1 = new Set([10, 20, 30]);
        const s2 = cloneDeep(s1);
        expect(s2.size).toBe(3);

        const obj = {
            set: new Set([10, 20, 30]),
        };
        const obj1 = cloneDeep(obj);
        expect(obj1.set.size).toBe(3);
    });

    it('循环引用', () => {
        const a: any = {};
        a.self = a;
        const b = cloneDeep(a);
        // NOTE: toBe 比较引用结果 toEqual 比较数据结构
        expect(b.self).toBe(b);
    });
});
