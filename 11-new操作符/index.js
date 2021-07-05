
function myNew(constructor, ...args) {
    let a = Object.create(constructor.prototype);
    constructor.apply(a, args)
    return a
}


function Person(name, age){
    this.name = name
    this.age = age
}

// let a = Object.create(Person.prototype)
// let b = Person.apply(a, ['yasuo', 17]);


// console.log('aaa', a, '||', b)
let yasuo = myNew(Person, 'yasuo', 17)
console.log(yasuo)

