Promise.resolve().then(() => {
	console.log(0);
	return Promise.resolve(4)
		.then((e) => e)
		.then((e) => e)
		.then((data) => {
			console.log(data);
		})
		.then(() => {
			console.log(6);
		});
});

Promise.resolve()
	.then(() => {
		console.log(1);
	})
	.then(() => {
		console.log(2);
	})
	.then(() => {
		console.log(3);
	})
	.then(() => {
		console.log(5);
	});

// 0 1 2 3 4 5 6
