/**
 *
 * @param obj
 * @param map weak map 为了避免循环引用
 */
export default function cloneDeep(obj: any, map = new WeakMap()): any {
    if (typeof obj !== 'object' || obj == null) return obj;

    const objFromMap = map.get(obj);
    if (objFromMap) return objFromMap;

    let target: any = {};
    // NOTE: 使用 weakmap 存储 obj【要深拷贝的对象】与target【深拷贝的结果】
    //       这里是为了处理循环引用。
    //       weakmap 中存储的都是弱引用,不会影响垃圾回收，内存泄漏，直接返回就行了
    map.set(obj, target);

    // Map
    if (obj instanceof Map) {
        target = new Map();
        obj.forEach((v, k) => {
            const v1 = cloneDeep(v, map);
            // NOTE: key 也需要深拷贝，可能是引用类型
            const k1 = cloneDeep(k, map);
            target.set(k1, v1);
        });
    }

    // Set
    if (obj instanceof Set) {
        target = new Set();
        obj.forEach(v => {
            const v1 = cloneDeep(v, map);
            target.add(v1);
        });
    }

    //Array
    if (obj instanceof Array) {
        target = obj.map(item => cloneDeep(item, map));
    }

    // Object
    for (const key in obj) {
        // NOTE: Object
        const val = obj[key];
        const val1 = cloneDeep(val, map);
        // Object 的key 都是值类型，无需再深拷贝
        target[key] = val1;
    }

    return target;
}
