# Bit Mask

这个目录包含两个实验：

- `index.js`：用 bit mask 演示任务优先级集合的判断方式，思路接近 React Fiber Lane。
- `index.html`：提供演示页面结构，并通过 `idle-scheduler.js` 引入调度逻辑。
- `idle-scheduler.js`：用大量模拟任务对比“同步阻塞执行”和 `requestIdleCallback` 分片调度的差异。

## 1. Bit Mask 知识点

bit mask 的核心思想是：用一个整数的不同二进制位表示不同状态、权限或优先级。

例如：

```js
const SyncLane = 0b0001;
const InputContinuousLane = 0b0100;
const DefaultLane = 0b10000;
```

每一位都可以代表一种任务类型或优先级。多个任务可以通过按位或 `|` 合并成一个集合，也可以通过按位与 `&` 判断两个集合是否有交集。

### 判断两个 Lane 是否有交集

```js
function includesSomeLane(a, b) {
	return (a & b) !== NoLanes;
}
```

如果 `a & b` 不等于 `0`，说明两个 lane 集合至少有一个二进制位同时为 `1`，也就是存在交集。

### 判断 Fiber 是否参与本次渲染

```js
function shouldParticipateInRender(fiberLanes, renderLanes) {
	return (fiberLanes & renderLanes) !== NoLanes;
}
```

这里的含义是：如果当前 fiber 上挂着的任务优先级和本次渲染优先级有交集，那么该 fiber 需要参与本轮渲染。

示例：

```js
const renderLanes = 0b1010;

const fiber1Lanes = 0b0010; // 有交集，参与渲染
const fiber2Lanes = 0b0100; // 无交集，不参与渲染
const fiber3Lanes = 0b1111; // 有交集，参与渲染
```

### 获取最高优先级 Lane

```js
function getHighestPriorityLane(lanes) {
	return lanes & -lanes;
}
```

`lanes & -lanes` 可以取出最右侧的 `1`。在这个示例里，越靠右的二进制位优先级越高，所以这个表达式可以快速取出最高优先级 lane。

## 2. requestIdleCallback 知识点

`index.html` 和 `idle-scheduler.js` 演示的是浏览器主线程调度问题。

页面中有两个执行方式：

- “执行同步任务（阻塞）”：一次性同步执行所有任务。
- “使用 requestIdleCallback”：在浏览器空闲时间分批执行任务。

当前模拟任务数量是：

```js
this.totalTasks = 100000;
```

每个任务都会忙等 `5-25ms`：

```js
while (performance.now() - start < duration) {
	result += Math.random();
}
```

## 3. 为什么同步按钮会导致页面无响应

点击“执行同步任务（阻塞）”后，会进入 `startNormalTasks()`：

```js
this.tasks.forEach((task) => {
	task.execute();
	this.completedTasks = completed;
	this.updateProgress();
});
```

这段代码会在主线程里连续执行 `100000` 个任务，中间没有让出执行权。

按当前任务耗时估算：

```text
100000 * 5-25ms = 500000-2500000ms
约 8 分钟到 41 分钟
```

这段时间内浏览器无法处理点击、输入、鼠标移动、页面重绘、进度条刷新和 `requestAnimationFrame`。Chrome 检测到页面长时间无法响应后，就会弹出“页面无响应”提示。

这不是代码抛错，而是同步 CPU 任务过重导致主线程被长期占满。

## 4. requestIdleCallback 的作用

`requestIdleCallback` 会在浏览器相对空闲时执行回调，并通过 `deadline.timeRemaining()` 告诉开发者当前帧还剩多少可用时间。

示例中的核心逻辑：

```js
while (deadline.timeRemaining() > 0 && this.tasks.length > 0) {
	const task = this.tasks.shift();
	task.execute();
	this.completedTasks++;
	this.updateProgress();
}
```

它的作用是：当前帧还有空闲时间时就多执行几个任务；空闲时间用完后停止，下一次再继续请求 `requestIdleCallback`。

这样可以避免长时间独占主线程，让浏览器有机会处理用户输入、页面重绘和其他事件。

## 5. 两种执行方式对比

| 方式 | 特点 | 页面表现 |
| --- | --- | --- |
| 同步执行 | 一次性跑完所有任务，不让出主线程 | 页面卡死，任务量大时出现“页面无响应” |
| `requestIdleCallback` | 利用浏览器空闲时间分批执行 | 页面仍有机会响应交互，但总耗时可能更长 |

## 6. 实验结论

- bit mask 适合表达多个布尔状态、权限集合、任务优先级集合。
- `&` 可以快速判断两个集合是否有交集。
- `lanes & -lanes` 可以快速取出最右侧的 `1`，常用于获取最高优先级位。
- 大量同步 CPU 任务会阻塞浏览器主线程，导致页面无响应。
- `requestIdleCallback` 可以把非紧急任务拆到浏览器空闲时间执行，但它不适合处理必须立刻完成的关键任务。
- 即使使用 `requestIdleCallback`，如果单个任务本身耗时太长，也仍然可能造成卡顿；真正可靠的优化方式是拆分任务粒度，或把重计算移到 Web Worker。
