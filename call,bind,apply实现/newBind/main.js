function person(a, b, c) {
  console.log(this.name)
  console.log(a, b, c)
}

person.prototype.collection = '收藏'
var egg = { name: '蛋老师' }

Function.prototype.newBind = function() {
    let target = Array.prototype.slice.call(arguments, 0, 1)[0]
    let args = Array.prototype.slice.call(arguments, 1)
    // 指向原生函数
    let that = this;

    function o(){}
    function newfn() {
        let arr2 = Array.prototype.slice.call(arguments)
        args = args.concat(arr2);
        // 使用了new
        console.log(this, 'test')
        // // 使用了 new
        if(this instanceof newfn) {
            console.log('new')
            return that.apply(this, args)
        // 
        } else {

            console.log('!new')
            return that.apply(target, args);
        }

        // return that.apply(target, args);
    }
    o.prototype = that.prototype
    newfn.prototype = new o()

    return newfn

}




let test = person.newBind(egg, 1, 2, 3)
// test(1,2,3)
// console.log('ppppppp')
let p = new test()
console.log('pppp', p)
