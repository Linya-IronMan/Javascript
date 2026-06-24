function MyPromise(fn) {
    let that = this
    that.status = 'pending'
    that.value = ''

    function resolve(value) {
        if (that.status === 'pending') {
            that.status = 'resolve'
            that.value = value;
        }
        
    }

    function reject(value) {
        if (that.status === 'pending') {
            that.status = 'reject'
            that.value = value
        }
    }

    fn(resolve, reject)
}

MyPromise.prototype.then = function(onResolve, onReject) {
     if (this.status === 'resolve') {
         onResolve(this.value)
     } else if (this.status === 'reject') {
         onReject(this.value)
     }
}

let p = new MyPromise((resolve, reject) => {
    resolve(1)
    reject(2)
}).then(data => {
    console.log(data)
}, err => {
    console.log(err)
})
