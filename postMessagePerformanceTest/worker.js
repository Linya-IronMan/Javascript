/**
 * Web Worker 线程脚本：接收数据并回传，记录 Worker 内部的处理耗时。
 */

self.onmessage = function (e) {
  const { type, data } = e.data;
  const start = performance.now();
  let processTime = 0;

  switch (type) {
    case 'json-obj': {
      // 结构化克隆的数据已经解析为对象
      // 简单访问一个属性以模拟使用数据
      const keys = Object.keys(data);
      const dummy = data[keys[0]];
      processTime = performance.now() - start;
      
      self.postMessage({
        type: 'json-obj',
        workerTime: processTime,
        status: 'done'
      });
      break;
    }

    case 'json-str': {
      // 需要手动反序列化
      const obj = JSON.parse(data);
      const keys = Object.keys(obj);
      const dummy = obj[keys[0]];
      processTime = performance.now() - start;

      self.postMessage({
        type: 'json-str',
        workerTime: processTime,
        status: 'done'
      });
      break;
    }

    case 'transferable': {
      // data 是一个 ArrayBuffer
      const view = new Uint8Array(data);
      // 模拟读取部分数据
      const dummy = view[0] + view[view.length - 1];
      processTime = performance.now() - start;

      // 将 ArrayBuffer 重新转移回主线程，实现完整闭环
      self.postMessage({
        type: 'transferable',
        workerTime: processTime,
        data: data,
        status: 'done'
      }, [data]);
      break;
    }

    case 'sab': {
      // data 是 SharedArrayBuffer
      const view = new Uint8Array(data);
      // 模拟写入数据：在首尾做一点小改动，主线程也可以看到
      view[0] = 42;
      view[view.length - 1] = 99;
      processTime = performance.now() - start;

      self.postMessage({
        type: 'sab',
        workerTime: processTime,
        status: 'done'
      });
      break;
    }
  }
};
