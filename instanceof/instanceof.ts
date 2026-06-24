export function myInstanceof(instance: any, origin: any) {
    if (instance == null) return false; // null undefined

    const type = typeof instance;
    // NOTE: 值类型返回 false
    if (type !== 'object' && type !== 'function') {
        return false;
    }

    let tempInstance = instance; // NOTE: 为了防止修改instance
    while (tempInstance) {
        if (tempInstance.__proto__ === origin.prototype) {
            return true;
        }
        tempInstance = tempInstance.__proto__;
    }

    return false;
}
