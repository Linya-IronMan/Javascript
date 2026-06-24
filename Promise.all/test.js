Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let resolvedCounter = 0;
        let resolveResult = new Array(promises);

        for (let i = 0; i < promises.length; i ++) {
            // 这里可以使用 Promise.resolve(promises[i]) 因为无法保证 proomises[i] 是 Promise 实例
            promises[i].then(data => {
                console.log(data, '=====')
                resolvedCounter++

                resolveResult[i] = data;
                if (resolvedCounter === promises.length) {
                    console.log(789456132)
                    resolve(resolveResult)
                }

            }, reason => {
                reject(reason)
            })
        }
    })
    
}

let a = new Promise(resolve => { resolve(1) })
let b = new Promise(resolve => { resolve(2) })
let c = new Promise(resolve => { resolve(3) })

a.then(data => {
    console.log('======||||||', data)   
})

let result = Promise.all([a, b, c])
console.log(result, 'result ====')
  
  result.then(data => {
      console.log(data, data instanceof Array, "*********")
  })
