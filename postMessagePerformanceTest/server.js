const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // 过滤并规范化请求路径，移除查询参数
  let safePath = req.url.split('?')[0];
  
  // 防止路径穿越攻击
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  // 检查请求文件是否存在
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - 文件未找到');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      // 必须配置以下标头以支持 SharedArrayBuffer
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => {
      console.error(streamErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error - 读取文件失败');
      }
    });
    stream.pipe(res);
  });
});

/**
 * 启动服务，如果端口占用则自增重试。
 * @param {number} port 尝试绑定的端口号
 */
function startServer(port) {
  server.listen(port, () => {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m 性能测试服务已成功启动：`);
    console.log(`  👉 \x1b[36mhttp://localhost:${port}\x1b[0m`);
    console.log(`\x1b[90m(已配置 Cross-Origin-Opener-Policy 与 Cross-Origin-Embedder-Policy 标头)\x1b[0m\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = err.port + 1;
    console.log(`\x1b[33m[INFO]\x1b[0m 端口 ${err.port} 已被占用，正在尝试端口 ${nextPort}...`);
    startServer(nextPort);
  } else {
    console.error(`\x1b[31m[ERROR]\x1b[0m 服务启动出错:`, err);
  }
});

// 默认从 8080 端口开始尝试
startServer(8080);
