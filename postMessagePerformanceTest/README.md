# postMessage Performance Comparison Test

这是一个用于对比在 Web Worker 与主线程之间，通过 `postMessage` 传输大量数据时的性能表现的测试子项目。

## 测试技术对比

在现代 Web 开发中，主线程与 Web Worker 或 iframe 通信时存在以下几种典型的数据传输方式：

1. **JSON 对象 (Structured Clone)**：
   - 采用 HTML 标准规定的结构化克隆算法。浏览器会在发送端深度拷贝对象，在接收端还原，适合一般大小的对象，但数据庞大时对主线程的阻塞和内存分配都相当昂贵。

2. **JSON 字符串 (Serialize + Copy)**：
   - 先执行 `JSON.stringify(obj)` 变成字符串，然后在 Worker 内部执行 `JSON.parse(str)`。在某些老旧的浏览器引擎上，字符串拷贝可能稍快于结构化克隆，但在现代浏览器中这通常是双重序列化的开销。

3. **ArrayBuffer (Transferable)**：
   - 使用可转移对象（Transferable Objects），在 `postMessage` 的第二个参数中指定需要转移的 `ArrayBuffer` 的所有权。浏览器会在发送端将该内存标记为“被剥离（detached）”，并将指针直接传给 Worker。这是**零拷贝（Zero-Copy）**，耗时极短，传输速度不受数据体积影响。

4. **SharedArrayBuffer (Shared Memory)**：
   - 主线程与 Worker 共享同一块物理内存空间。双方直接通过内存索引或 `Atomics` 并发读写这块缓冲区，完全不需要拷贝和所有权的让渡。**传输时间几乎为 0**。

---

## 本地启动与跨域隔离配置

由于安全原因（防范 Spectre 漏洞），现代浏览器对 `SharedArrayBuffer` 施加了严格的限制。**如果不配置跨域隔离（Cross-Origin Isolation）响应头，`SharedArrayBuffer` 会直接未定义或报错。**

### 启动方案

我们可以使用 `http-server`（或任何能定制 HTTP 响应头的本地服务器）来启动本项目：

```bash
# 进入本项目所在目录
cd projects/Javascript/postMessagePerformanceTest

# 运行本地开发服务器并附加跨域隔离头
npx -y http-server . -p 8080 --cors -H '{"Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp"}'
```

接着打开浏览器访问 `http://localhost:8080` 即可开始测试。

---

## 预期测试结论

在不同大小的数据量下（5 MB、10 MB、20 MB、50 MB），测试结果呈现出极大的分化：

- **JSON 对象 / 字符串**：随着大小增加，传输与解析的总时间线性增长，在 20MB 以上时可能导致主线程明显的卡顿（几十到几百毫秒）。
- **ArrayBuffer (可转移)**：无论数据量是 5MB 还是 50MB，主线程发送耗时通常只有不到 1ms，且 Worker 往返耗时基本保持在 1ms - 5ms 左右。
- **SharedArrayBuffer**：极速瞬时反应（几乎 0ms），因为不发生任何数据层面的传输。
