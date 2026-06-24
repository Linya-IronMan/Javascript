function Foo(name) {
    this.name = name;
    this.city = 'Beijing';
}

Foo.prototype.getName = function () {
    return this.name;
};
/**  */

// ts 泛型
export const customNew = <T>(constructor: Function, ...args: any[]): T => {
    // 1. 创建一个空对象，继承 constructor 对象
    const obj = Object.create(constructor.prototype);
    // 2. 将 obj 作为 this 执行 constructor ， 传入参数
    constructor.apply(obj, args);
    // 3. 返回 obj
    console.info(obj);
    return obj;
};

// class Foo {
//     // property
//     name: string;
//     city: string;

//     constructor(name: string) {
//         this.name = name;
//         this.city = '背景';
//     }

//     getNmae() {
//         return this.name;
//     }
// }

// const f = customNew<Foo>(Foo, 'zhangyaxin');
