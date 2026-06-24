const createPromise = () => {
	return new Promise((resolve, _reject) => {
		const timer = setTimeout(() => {
			resolve("Hello");
			clearTimeout(timer);
		}, 1000);
	})
		.then((data) => {
			return data + " World";
		})
		.finally(() => {
			console.log("Finally");
		});
};

createPromise().then((data) => console.log("output", data)); // Hello World
