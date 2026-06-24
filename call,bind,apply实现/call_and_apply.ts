// @ts-ignore
Function.prototype.customCall = function (context: any, ...args: any[]) {
    if (context == null) context = globalThis;
    if (typeof context != 'object') context = new Object(context); // NOTE: 值类型会代替对象

    // NOTE: 使用Sumbol作为key永远不会重复，在向其他对象上添加一个自定义的属性名，
    // 为了防止自己添加的属性名与之后用户可能添加的属性名重复，使用Symbol
    const fnKey = Symbol();
    // NOTE: 将函数 this 绑定到 context 上，这样调用的时候当前函数中的this会自然发生改变
    context[fnKey] = this;
    const res = context[fnKey](...args);

    delete context[fnKey];

    return res;
};

// NOTE: Chrome 打印经常会打印出一个中间状态，

// @ts-ignore
Function.prototype.customApply = function (context: any, args: any[] = []) {
    if (context == null) context = globalThis;
    if (typeof context != 'object') context = new Object(context); // NOTE: 值类型会代替对象

    // NOTE: 使用Sumbol作为key永远不会重复，在向其他对象上添加一个自定义的属性名，
    // 为了防止自己添加的属性名与之后用户可能添加的属性名重复，使用Symbol
    const fnKey = Symbol();
    // NOTE: 将函数 this 绑定到 context 上，这样调用的时候当前函数中的this会自然发生改变
    context[fnKey] = this;
    const res = context[fnKey](...args);

    delete context[fnKey];

    return res;
};
