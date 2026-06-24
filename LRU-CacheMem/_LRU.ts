export default class LURCache {
    // NOTE: 是固定不变的，表示容量
    private length: number;
    private data = new Map();

    constructor(len: number) {
        if (len < 1) throw new Error('input an invalid length');

        this.length = len;
    }

    set(key: any, value: any) {
        if (this.data.has(key)) {
            this.data.delete(key);
        }
        this.data.set(key, value);

        if (this.data.size > this.length) {
            const delKey = this.data.keys().next().value;
            this.data.delete(delKey);
        }
    }

    get(key: any) {
        if (!this.data.has(key)) {
            return null;
        }
        const value = this.data.get(key);
        this.data.delete(key);
        this.data.set(key, value);
        return value;
    }
}
