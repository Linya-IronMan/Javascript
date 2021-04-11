let a = new Promise((resolve, reject) => {
    resolve(1)
}).then(data => {
    console.log(data, 'then1')
    return 2222222   // 通过return的方式可以将 数据传递到下一个then中
}).then(data => {
    console.log('then2', data)
})

