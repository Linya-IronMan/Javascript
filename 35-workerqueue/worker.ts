const taskQueue = [];

function processTask(task) {
	// 这里是任务处理逻辑，例如：
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(`Processed task with data: ${task.data}`);
		}, task.processTime);
	});
}

function dequeueAndProcess() {
	if (taskQueue.length > 0) {
		const task = taskQueue.shift();
		processTask(task).then((result) => {
			postMessage({ status: "completed", result: result });
			dequeueAndProcess(); // 继续处理下一个任务
		});
	}
}

self.onmessage = function (event) {
	const task = event.data;
	taskQueue.push(task);
	if (taskQueue.length === 1) {
		// 如果队列之前为空，开始处理任务
		dequeueAndProcess();
	}
};
