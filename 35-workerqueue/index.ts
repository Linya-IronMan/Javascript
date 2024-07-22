const numWorkers = 4;
const workers = [];

for (let i = 0; i < numWorkers; i++) {
	const worker = new Worker("worker.js");
	worker.onmessage = function (event) {
		console.log(`Worker response: ${event.data.result}`);
	};
	workers.push(worker);
}

function distributeTask(task) {
	const workerIndex = task.id % numWorkers; // 简单的轮询负载均衡
	workers[workerIndex].postMessage(task);
}

// 示例：分发任务
for (let i = 0; i < 10; i++) {
	distributeTask({
		id: i,
		data: `Task data ${i}`,
		processTime: 1000 * ((i % 5) + 1),
	});
}
