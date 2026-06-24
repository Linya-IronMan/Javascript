import {
    flatten1,
    flatten2 as flatten,
    flattenDeep1,
    flattenDeep2 as flattenDeep,
} from './index';

describe('数组扁平化', () => {
    it('空数组', () => {
        const res = flatten([]);
        expect(res).toEqual([]);
    });

    it('非嵌套数组', () => {
        const arr = [1, 2, 3];
        const res = flatten(arr);
        expect(res).toEqual([1, 2, 3]);
    });

    it('一级嵌套', () => {
        const arr = [1, 2, [10, 20], 3];
        const res = flatten(arr);
        expect(res).toEqual([1, 2, 10, 20, 3]);
    });

    it('二级嵌套', () => {
        const arr = [1, 2, [10, [100, 200], 20], 3];
        const res = flatten(arr);
        expect(res).toEqual([1, 2, 10, [100, 200], 20, 3]);
    });
});

describe('数组扁平化 - 深度', () => {
    it('空数组', () => {
        const res = flattenDeep([]);
        expect(res).toEqual([]);
    });

    it('非嵌套数组', () => {
        const arr = [1, 2, 3];
        const res = flattenDeep(arr);
        expect(res).toEqual([1, 2, 3]);
    });

    it('一级嵌套', () => {
        const arr = [1, 2, [10, 20], 3];
        const res = flattenDeep(arr);
        expect(res).toEqual([1, 2, 10, 20, 3]);
    });

    it('六级嵌套', () => {
        const arr = [1, 2, [10, [100, 200, [300]], 20], 3];
        const res = flattenDeep(arr);
        expect(res).toEqual([1, 2, 10, 100, 200, 300, 20, 3]);
    });
});
