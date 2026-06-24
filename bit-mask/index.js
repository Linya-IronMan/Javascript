const NoLanes = 0b0000000000000000000000000000000;
const NoLane = 0b0000000000000000000000000000000; // 优先级从高到低

const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;

function includesSomeLane(a, b) {
	return (a & b) !== NoLanes;
}

function shouldParticipateInRender(fiberLanes, renderLanes) {
	// 关键位运算：检查fiber的lanes与本次渲染的lanes是否有交集
	return (fiberLanes & renderLanes) !== NoLanes;
}
// 获取单个Lane的最高优先级
function getHighestPriorityLane(lanes) {
	// 找到最右边的1（优先级最高）
	return lanes & -lanes;
}

// 比较两个Lane的优先级
function isHigherPriority(a, b) {
	// 比较两个Lane的位位置，更靠右的优先级更高
	return (a & b) === 0 ? false : getHighestPriorityLane(a) === a;
}

// 获取Lane的优先级数值
function getLanePriority(lane) {
	// 通过clz32找到最高位的位置
	const index = 31 - Math.clz32(lane);
	return 31 - index; // 越小的数字表示优先级越高
}

const renderLanes = 0b1010; // 包含第1和第3优先级的任务

// 不同Fiber的lanes情况
const fiber1Lanes = 0b0010; // 只有第1优先级 → 参与渲染 (0b1010 & 0b0010 = 0b0010 ≠ 0)
const fiber2Lanes = 0b0100; // 只有第2优先级 → 不参与 (0b1010 & 0b0100 = 0)
const fiber3Lanes = 0b1111; // 包含多个优先级 → 参与 (有交集)

console.log(shouldParticipateInRender(fiber1Lanes, renderLanes)); // true
console.log(shouldParticipateInRender(fiber2Lanes, renderLanes)); // false
console.log(shouldParticipateInRender(fiber3Lanes, renderLanes)); // true
