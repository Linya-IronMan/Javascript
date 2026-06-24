/**
 * 主线程脚本：生成数据、操控 Web Worker 进行并发通信，计算传输及解析耗时，并以图表和表格展示结果。
 */

// 缓存测试过的最高性能数据以缩放图表条
const maxThroughputRecord = {
  'json-obj': 0,
  'json-str': 0,
  'transferable': 0,
  'sab': 0
};

/**
 * 检查 SharedArrayBuffer 支持情况并更新 UI 警告。
 */
function checkSabSupport() {
  const hasSab = typeof SharedArrayBuffer !== 'undefined';
  const warningEl = document.getElementById('sabWarning');
  if (hasSab) {
    warningEl.style.display = 'none';
  } else {
    warningEl.style.display = 'block';
    // 禁用 SharedArrayBuffer 选项
    const sabOption = document.querySelector('option[value="sab"]');
    if (sabOption) {
      sabOption.disabled = true;
      sabOption.textContent += ' (浏览器或环境不支持)';
    }
  }
}

/**
 * 生成包含指定大小字符数据的普通 JavaScript 对象。
 * @param {number} mb 目标大小（MB）
 * @returns {object} 包含大字符串属性的对象
 */
function generateLargeObject(mb) {
  const targetBytes = mb * 1024 * 1024;
  const obj = {};
  const chunkSize = 100 * 1024; // 每个属性值 100 KB
  const chunkText = 'x'.repeat(chunkSize);
  const numChunks = Math.floor(targetBytes / chunkSize);
  
  for (let i = 0; i < numChunks; i++) {
    obj[`key_${i}`] = chunkText;
  }
  return obj;
}

/**
 * 生成指定大小的普通 ArrayBuffer。
 * @param {number} mb 目标大小（MB）
 * @returns {ArrayBuffer}
 */
function generateArrayBuffer(mb) {
  const size = mb * 1024 * 1024;
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  view[0] = 1;
  view[size - 1] = 255;
  return buffer;
}

/**
 * 生成指定大小的 SharedArrayBuffer。
 * @param {number} mb 目标大小（MB）
 * @returns {SharedArrayBuffer}
 */
function generateSharedArrayBuffer(mb) {
  const size = mb * 1024 * 1024;
  const sab = new SharedArrayBuffer(size);
  const view = new Uint8Array(sab);
  view[0] = 1;
  view[size - 1] = 255;
  return sab;
}

/**
 * 更新页面上的 CSS 柱状图。
 * @param {string} mode 模式标识
 * @param {number} throughput 吞吐率 (MB/s)
 * @param {number} duration 耗时 (ms)
 */
function updateChart(mode, throughput, duration) {
  maxThroughputRecord[mode] = Math.max(maxThroughputRecord[mode], throughput);
  
  // 找出所有记录中的最大值，用作 100% 宽度的基准
  const absoluteMax = Math.max(...Object.values(maxThroughputRecord), 1);
  
  // 更新各柱状图宽度
  Object.keys(maxThroughputRecord).forEach(m => {
    const val = maxThroughputRecord[m];
    const bar = document.getElementById(`bar-${m}`);
    const valText = document.getElementById(`val-${m}`);
    
    if (val > 0) {
      const percentage = (val / absoluteMax) * 100;
      bar.style.width = `${percentage}%`;
    }
  });

  // 更新当前测试模式的具体数值显示
  const currentValText = document.getElementById(`val-${mode}`);
  if (currentValText) {
    currentValText.textContent = `${duration.toFixed(1)} ms`;
  }
}

/**
 * 在表格中添加一条详细的测试记录。
 * @param {string} mode 模式
 * @param {number} size 大小 (MB)
 * @param {string} sendTime 发送主线程耗时 (ms)
 * @param {string} totalTime 总往返耗时 (ms)
 * @param {number} throughput 吞吐率 (MB/s)
 */
function appendHistoryRow(mode, size, sendTime, totalTime, throughput) {
  const tbody = document.getElementById('historyBody');
  
  // 如果是首次插入，先清除“暂无数据”行
  if (tbody.rows.length === 1 && tbody.rows[0].cells.length === 1) {
    tbody.innerHTML = '';
  }

  const tr = document.createElement('tr');
  
  let modeBadge = '';
  switch (mode) {
    case 'json-obj': modeBadge = `<span class="badge json-obj">JSON 对象</span>`; break;
    case 'json-str': modeBadge = `<span class="badge json-str">JSON 字符串</span>`; break;
    case 'transferable': modeBadge = `<span class="badge transferable">ArrayBuffer (可转移)</span>`; break;
    case 'sab': modeBadge = `<span class="badge sab">SharedArrayBuffer</span>`; break;
  }

  tr.innerHTML = `
    <td>${modeBadge}</td>
    <td>${size} MB</td>
    <td>${sendTime}</td>
    <td>${totalTime}</td>
    <td><strong>${throughput.toFixed(1)} MB/s</strong></td>
  `;
  
  tbody.insertBefore(tr, tbody.firstChild);
}

/**
 * 绑定 UI 交互并执行核心基准测试。
 */
function init() {
  checkSabSupport();

  const startBtn = document.getElementById('startBtn');
  const clearBtn = document.getElementById('clearBtn');
  
  clearBtn.addEventListener('click', () => {
    document.getElementById('historyBody').innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary);">暂无测试数据，请点击上方按钮启动测试。</td>
      </tr>
    `;
    // 重置柱状图
    Object.keys(maxThroughputRecord).forEach(m => {
      maxThroughputRecord[m] = 0;
      const bar = document.getElementById(`bar-${m}`);
      const valText = document.getElementById(`val-${m}`);
      bar.style.width = '0%';
      valText.textContent = '--';
    });
  });

  startBtn.addEventListener('click', async () => {
    const size = Number(document.getElementById('dataSize').value);
    const mode = document.getElementById('transferMode').value;
    
    startBtn.disabled = true;
    startBtn.textContent = '数据准备中...';

    // 延迟以渲染按钮禁用状态
    await new Promise(resolve => setTimeout(resolve, 50));

    let payload;
    let transferList = [];
    let preparationStart = performance.now();

    // 1. 准备数据
    if (mode === 'json-obj') {
      payload = { type: 'json-obj', data: generateLargeObject(size) };
    } else if (mode === 'json-str') {
      const obj = generateLargeObject(size);
      const str = JSON.stringify(obj);
      payload = { type: 'json-str', data: str };
    } else if (mode === 'transferable') {
      const buffer = generateArrayBuffer(size);
      payload = { type: 'transferable', data: buffer };
      transferList = [buffer];
    } else if (mode === 'sab') {
      const sab = generateSharedArrayBuffer(size);
      payload = { type: 'sab', data: sab };
    }

    startBtn.textContent = '测试运行中...';

    // 2. 创建 Worker 并进行通信测试
    const worker = new Worker('worker.js');
    
    const startSend = performance.now();
    worker.postMessage(payload, transferList);
    const endSend = performance.now();
    
    // 发送耗时（这代表主线程被阻塞的时间）
    const sendDuration = endSend - startSend;

    worker.onmessage = (e) => {
      const endTotal = performance.now();
      const totalDuration = endTotal - startSend;
      
      // 吞吐率计算：大小(MB) / (往返总耗时(s))
      const throughput = size / (totalDuration / 1000);
      
      // 更新 UI 展示
      updateChart(mode, throughput, totalDuration);
      appendHistoryRow(
        mode,
        size,
        `${sendDuration.toFixed(2)} ms`,
        `${totalDuration.toFixed(1)} ms`,
        throughput
      );

      // 清理环境
      worker.terminate();
      startBtn.disabled = false;
      startBtn.textContent = '启动基准测试';
    };

    worker.onerror = (err) => {
      console.error('Worker error:', err);
      alert('Worker 运行出错，详情请查看控制台。');
      worker.terminate();
      startBtn.disabled = false;
      startBtn.textContent = '启动基准测试';
    };
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
