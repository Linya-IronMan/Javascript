const fs = require('fs');
const path = require('path');
const scanProjects = require('./scanner');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const indexPath = path.join(docsDir, 'index.md');

/**
 * 将项目列表根据分类（category）进行归组
 * 
 * @param {Array<object>} items - 项目列表
 * @returns {Record<string, Array<object>>} 按分类归组后的对象
 */
function groupByCategory(items) {
    return items.reduce((groups, item) => {
        const category = item.category || '未分类';
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
    }, {});
}

/**
 * 为特定的分类生成 Markdown 表格字符串
 * 
 * @param {Array<object>} projects - 同分类下的项目列表
 * @returns {string} 渲染出的 Markdown 表格行文本
 */
function createTable(projects) {
    const rows = [
        '| 编号 | 项目 | 别名 | 启动命令 | 笔记 |',
        '|---|---|---|---|---|',
    ];

    projects.forEach(project => {
        const readme = project.readme ? `[README](../${project.readme})` : '-';
        rows.push(`| ${project.id} | ${project.name} | \`${project.alias}\` | \`pnpm demo ${project.alias || project.id}\` | ${readme} |`);
    });

    return rows.join('\n');
}

/**
 * 生成全量项目的 Markdown 索引内容
 * 
 * @returns {string} 生成的 Markdown 文本内容
 */
function generateMarkdown() {
    const projects = scanProjects();
    const groups = groupByCategory(projects);
    const lines = [
        '# JavaScript 实验项目索引',
        '',
        '该索引由目录中的 package.json 自动扫描生成，可通过 `pnpm docs:index` 重新生成。',
    ];

    Object.keys(groups).forEach(category => {
        lines.push('', `## ${category}`, '', createTable(groups[category]));
    });

    lines.push('');
    return lines.join('\n');
}

fs.writeFileSync(indexPath, generateMarkdown());
console.log(`已生成索引：${path.relative(rootDir, indexPath)}`);

