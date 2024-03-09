export function curry(fn: Function) {
    let len = fn.length;
    let args = [];
    // 特别注意ts中独立函数的第一个参数是this
    function calc(this: any, ...newArgs) {
        args = args.concat(newArgs);
        if (args.length < len) {
            return calc;
        } else {
            // 需要特别注意对参数的截取
            return fn.apply(this, args.slice(0, len));
        }
    }
    return calc;
}

/**
 * curry(fn)
 * 有点小问题，尽量不使用ts中的this，不太好懂
 */
export function _curry(fn: Function) {
    const len = fn.length;
    let args = [];

    function func(...arg) {
        args = args.concat(arg);
        if (args.length < len) {
            return func;
        } else {
            return fn(...args);
        }
    }
    return func;
}
