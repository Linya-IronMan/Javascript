 Promise.all = function(promises) {
    return new Promise(function(resolve, reject) {
      var resolvedCounter = 0
      var promiseNum = promises.length
      // 创建 promiseNum 个空元素的数组
      // 问题： 如果创建的个数为0 . 1
      var resolvedValues = new Array(promiseNum)
    //   console.log(resolvedValues, '=======resolvedValues')
      for (var i = 0; i < promiseNum; i++) {
        (function(i) {
        // let curPromise = promises[i]
        // 为什么要使用 Promise.resolve 再次传递一下？ 感觉直接俄使用 
        // curPromise.then 也是可以的
        // 状态发生改变之后需要 resolvedCounter++ 
          Promise.resolve(promises[i]).then(function(value) {
            resolvedCounter++
            resolvedValues[i] = value
            if (resolvedCounter == promiseNum) {
                return resolve(resolvedValues)
            }
          }, function(reason) {
            // 这里的 return 好像根本没有必要 没错 作者说了 根本没有必要
            return reject(reason)
          })
        })(i)
      }
    })
  }

  let a = new Promise(resolve => { resolve(1) })
  let b = new Promise(resolve => { resolve(2) })
  let c = new Promise(resolve => { resolve(3) })

  Promise.all([a, b, c])
  .then(data => {
      console.log(data, data instanceof Array)
  })

