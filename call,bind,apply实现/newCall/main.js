
Function.prototype.newCall = function() {
    let func = this;
    let newArgs = []
    for (let i = 0; i < arguments.length; i ++) {
      newArgs.push(arguments[i])
    }
    
     [target, ...args] = newArgs
     
     target.func = this
    //  如果不能使用 ES6 中的 ... 语法，
    // 那么就需要使用 eval("target.func(arguments[1], arguments[2], arguments[3])")
    //  eval的字符串 可以通过for 循环生成。
     let result = target.func(...args)
     delete target.func
     return result

} 

let person = {
    name: 'person',
    getName(age) {
        console.log(this.name, age)
        // return this.name + age
    }
}


let student = {
    name: 'student',
    getName(age) {
        console.log(this.name, age)
        // return this.name;
    }
}



person.getName(78)
person.getName.call(student, 18)
