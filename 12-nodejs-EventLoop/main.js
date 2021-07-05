

setTimeout(function() {
    console.log(1)
}, 50)

process.nextTick(() => {
    console.log(2)
})

setTimeout(function() {
    console.log(3)
})

process.nextTick(() => {
    console.log(4)
})

setImmediate(() => {
    console.log(5)
})

// time: 1 3

// timer: 
// check: 5

// wei: 2 4
// 2 4 3 



