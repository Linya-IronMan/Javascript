export const flatten1 = (arr: Array<any>) => {
    const res: any[] = [];

    arr.forEach(item => {
        if (Array.isArray(item)) {
            (item as Array<Number>).forEach(n => res.push(n));
        } else {
            res.push(item);
        }
    });
    return res;
};

export const flatten2 = (arr: any[]) => {
    let res: any[] = [];

    arr.forEach(item => {
        res = res.concat(item);
    });

    return res;
};

// NOTE: React 要使用不可变数据
// NOTE: push 可以修改数组，但是 concat 不能修改数组

// 功能测试
const arr = [1, [2, [3], 4], 5];
console.info(flatten2(arr));
