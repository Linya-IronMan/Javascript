/**
 * NOTE: LRU
 * 有容量的限制，超出容量的时候，会替换优先级较低的存储
 * 新的替换元素会获取较高的优先级
 * 访问过后，存储顺序会改变，被访问的元素会变成较为活跃的元素
 */

export default class LRUCache {
    private length: number;
    private data: Map<any, any> = new Map();

    constructor(length: number) {
        if (length < 1) throw new Error('invalid length');
        this.length = length;
    }

    set(key: any, value: any) {
        const data = this.data;

        if (data.has(key)) {
            // NOTE: 删除之后重建，会将数据放在最前面，优先级有改变
            data.delete(key);
        }
        data.set(key, value);

        if (data.size > this.length) {
            // NOTE: 如果超出了容量，则删除Map最老的元素
            // NOTE: Map.keys().next() 获取到的就是优先级最差的元素
            // NOTE: Map.set 设置的元素，遍历的时候处于最后
            // NOTE: 内部的顺序类似于一个队列操作
            const delKey = data.keys().next().value;
            data.delete(delKey);
        }
    }

    get(key: any): any {
        const data = this.data;

        if (!data.has(key)) return null;

        const value = data.get(key);

        // NOTE: 删除再加进去，提升顺序
        data.delete(key);
        data.set(key, value);

        return value;
    }
}
