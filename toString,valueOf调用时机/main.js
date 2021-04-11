
var obj = {
  toString:function(){
      console.log('toString')
      return Object.prototype.toString.call(this)
  },
  valueOf:function(){
      console.log('valueOf')
      return Object.prototype.valueOf.call(this)
  }
}
console.log(obj); // toString valueOf
console.log(+obj);
console.log(obj=={});
console.log(obj==={}) // 触发 toString valueOf
console.log(obj=='test') 
console.log(obj==='test') 

/*
* Currying 中使用 toString 来实现柯里化
* 这就离谱，柯里化不应该受到语言的限制，我不认为其他语言中的函数都存在 类似 toString 这样的函数
* 会在进行隐式类型转化的时候调用toString
 */

