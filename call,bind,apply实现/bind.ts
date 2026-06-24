/**
 * bind 返回一个新的函数，但是不会执行
 * function fn() {}
 * const fn1 = fn.bind({x: 100});
 * fn1("")
 * 如果是箭头函数，不能改变this
 * 也可以绑定部分参数
 * fn.bind({x: 100}, 10, 20)
 */

// @ts-ignore
Function.prototype.customBind = function (context: any, ...bindArgs: any[]) {
    // context 是bind传入的this
    // bindArgs 是bind传入的各个参数
    const self = this; // 当前函数本身

    return function (...args: any[]) {
        const newArgs = bindArgs.concat(args);
        return self.apply(context, newArgs);
    };
};

// test
function fn(this: any, a: any, b: any, c: any) {
    console.info(this, a, b, c);
}

// fn(10, 20, 30);

// @ts-ignore
const fn1 = fn.customBind({ x: 100 }, 10);
fn1(20, 30);
