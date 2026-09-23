class IdleTaskScheduler {
	constructor() {
		this.tasks = [];
		this.isRunning = false;
		this.taskId = 0;
		this.completedTasks = 0;
		// 使用 100000 个任务观察 requestIdleCallback 在大量任务下的分片调度效果。
		this.totalTasks = 100000;
		this.idleCallbackId = null;

		// 性能监控
		this.frameCount = 0;
		this.lastTime = performance.now();
		this.fps = 60;

		this.setupEventListeners();
		this.startFPSCounter();
	}

	// 添加模拟任务
	addTask(duration = 10) {
		return () => {
			const start = performance.now();
			// 模拟工作 - 执行一些计算
			let result = 0;
			while (performance.now() - start < duration) {
				result += Math.random();
			}
			return result;
		};
	}

	// 初始化任务队列
	initializeTasks() {
		this.tasks = [];
		this.completedTasks = 0;
		this.updateProgress();

		for (let i = 0; i < this.totalTasks; i++) {
			// 创建不同耗时的任务
			const duration = Math.random() * 20 + 5; // 5-25ms
			this.tasks.push({
				id: i,
				execute: this.addTask(duration),
				duration: duration,
			});
		}

		document.getElementById("taskCount").textContent = this.tasks.length;
	}

	// 使用 requestIdleCallback 执行任务
	startIdleTasks() {
		this.initializeTasks();
		this.log("开始使用 requestIdleCallback 执行任务");
		this.isRunning = true;

		const processTask = (deadline) => {
			const stats = document.getElementById("idleStats");

			// 在空闲时间内执行尽可能多的任务
			while (deadline.timeRemaining() > 0 && this.tasks.length > 0) {
				const task = this.tasks.shift();
				task.execute();
				this.completedTasks++;
				this.updateProgress();

				this.log(
					`任务 ${task.id} 完成 (剩余时间: ${deadline
						.timeRemaining()
						.toFixed(2)}ms)`,
				);
			}

			// 更新统计信息
			stats.innerHTML = `
                        <div>剩余空闲时间: <strong>${deadline
							.timeRemaining()
							.toFixed(2)}ms</strong></div>
                        <div>是否超时: ${
							deadline.didTimeout ? "是" : "否"
						}</div>
                        <div>已完成: ${this.completedTasks}/${
							this.totalTasks
						}</div>
                    `;

			if (this.tasks.length > 0) {
				// 还有任务，继续请求空闲回调
				this.idleCallbackId = requestIdleCallback(processTask);
			} else {
				this.log("所有任务完成！");
				this.isRunning = false;
			}

			document.getElementById("taskCount").textContent =
				this.tasks.length;
		};

		// 启动处理
		this.idleCallbackId = requestIdleCallback(processTask);
	}

	// 同步执行任务（模拟阻塞）
	startNormalTasks() {
		this.initializeTasks();
		this.log("开始同步执行任务（可能阻塞页面）");

		// 禁用交互测试
		this.disableInteractions(true);

		let completed = 0;
		const total = this.tasks.length;

		this.tasks.forEach(async () => {
			await run();
		});

		// 同步执行所有任务
		this.tasks.forEach((task, index) => {
			task.execute();
			completed++;

			// 更新进度（实际上UI不会实时更新，因为主线程被阻塞）
			this.completedTasks = completed;
			this.updateProgress();
		});

		this.tasks = [];
		this.log("同步任务完成！");
		this.disableInteractions(false);
	}

	// 更新进度显示
	updateProgress() {
		const progress = (this.completedTasks / this.totalTasks) * 100;
		document.getElementById("progress").style.width = progress + "%";
		document.getElementById("progressText").textContent =
			progress.toFixed(1) + "%";
	}

	// 添加日志
	log(message) {
		const logElement = document.getElementById("taskLog");
		const timestamp = new Date().toLocaleTimeString();
		const logEntry = document.createElement("div");
		logEntry.textContent = `[${timestamp}] ${message}`;
		logElement.appendChild(logEntry);
		logElement.scrollTop = logElement.scrollHeight;
	}

	// 设置事件监听器
	setupEventListeners() {
		let clickCount = 0;
		let mouseMoveCount = 0;

		document.getElementById("testButton").addEventListener("click", () => {
			clickCount++;
			document.querySelector("#testButton span").textContent = clickCount;
		});

		document.getElementById("testInput").addEventListener("input", (e) => {
			// 输入测试
		});

		document
			.getElementById("mouseArea")
			.addEventListener("mousemove", () => {
				mouseMoveCount++;
				document.querySelector("#mouseArea span").textContent =
					mouseMoveCount;
			});
	}

	// 禁用/启用交互
	disableInteractions(disabled) {
		const button = document.getElementById("testButton");
		const input = document.getElementById("testInput");

		button.disabled = disabled;
		input.disabled = disabled;
		input.placeholder = disabled ? "页面阻塞中..." : "尝试输入文字...";
	}

	// FPS 计数器
	startFPSCounter() {
		const countFPS = () => {
			this.frameCount++;
			const currentTime = performance.now();

			if (currentTime >= this.lastTime + 1000) {
				this.fps = Math.round(
					(this.frameCount * 1000) / (currentTime - this.lastTime),
				);
				this.lastTime = currentTime;
				this.frameCount = 0;

				document.getElementById("fps").textContent = this.fps;

				// FPS 颜色提示
				const fpsElement = document.getElementById("fps");
				if (this.fps < 30) {
					fpsElement.style.color = "red";
					fpsElement.style.fontWeight = "bold";
				} else if (this.fps < 50) {
					fpsElement.style.color = "orange";
				} else {
					fpsElement.style.color = "green";
				}
			}

			requestAnimationFrame(countFPS);
		};

		countFPS();
	}

	// 清除所有
	clearAll() {
		if (this.idleCallbackId) {
			cancelIdleCallback(this.idleCallbackId);
		}

		this.tasks = [];
		this.isRunning = false;
		this.completedTasks = 0;
		this.updateProgress();

		document.getElementById("taskLog").innerHTML = "";
		document.getElementById("idleStats").innerHTML = "等待任务开始...";
		document.getElementById("taskCount").textContent = "0";
	}
}

// 初始化调度器
const scheduler = new IdleTaskScheduler();

// 暴露给 HTML 中的 onclick 调用，保持页面结构和原交互方式不变。
window.startNormalTasks = function startNormalTasks() {
	scheduler.startNormalTasks();
};

window.startIdleTasks = function startIdleTasks() {
	scheduler.startIdleTasks();
};

window.clearAll = function clearAll() {
	scheduler.clearAll();
};

// 兼容性检查
if (!("requestIdleCallback" in window)) {
	document.querySelector(".warning").innerHTML +=
		'<br><strong style="color: red;">当前浏览器不支持 requestIdleCallback！</strong>';
}
