export default function cloneDeep(obj: any, map = new WeakMap()) {
    if (typeof obj !== 'object' || obj === null) return obj;

    let res: any = {};

    if (map.get(obj)) return map.get(obj);

    map.set(obj, res);

    // Map
    if (obj instanceof Map) {
        res = new Map();
        obj.forEach((k, v) => {
            res.set(cloneDeep(k, map), cloneDeep(v, map));
        });
    } else if (obj instanceof Set) {
        res = new Set();
        obj.forEach(item => {
            res.add(cloneDeep(item, map));
        });
    }
    // Array
    else if (obj instanceof Array) {
        res = obj.map(item => cloneDeep(item, map));
    } else {
        // Object 不止Object类型，Map Array Set Map 都会在这里
        console.info(obj, 'obj last');
        for (const key in obj) {
            res[key] = cloneDeep(obj[key], map);
        }
    }
    return res;
}
// export default function cloneDeep(obj: any, map = new WeakMap()) {
//     // 如果是简单类型，或者null直接返回
//     if (obj === null || typeof obj !== 'object') return obj;

//     let target: any = {};

//     // 处理循环引用
//     // 如果之前引用过，那么就直接返回
//     if (map.get(obj)) return map.get(obj);
//     // 如果之前没有引用过，将这个引用存储起来，下次检查
//     // Map 存储的一个key 是要clone的数据，value 是一个clone好的数据的引用
//     map.set(obj, target);

//     // 数组
//     if (obj instanceof Array) {
//         // target = [];
//         // obj.forEach((key, value) => {
//         //     target[key] = cloneDeep(value);
//         // });
//         target = obj.map(item => cloneDeep(item, map));
//     }

//     if (obj instanceof Map) {
//         target = new Map();
//         obj.forEach((key, value) => {
//             target.set(cloneDeep(key), cloneDeep(value, map));
//         });
//     }

//     if (obj instanceof Set) {
//         target = new Set();
//         obj.forEach(value => {
//             target.add(cloneDeep(value));
//         });
//     }

//     // 对象是最后都处理完成之后的默认类型
//     for (const key in obj) {
//         target[key] = cloneDeep(obj[key], map);
//     }

//     return target;
// }
