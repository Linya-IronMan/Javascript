const path = require('path');
const scanProjects = require('./scanner');

/**
 * 将项目列表根据分类（category）进行归组
 * 
 * @param {Array<object>} items - 待分类的项目对象数组
 * @returns {Record<string, Array<object>>} 分组后的键值对对象
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
 * 格式化输出单个项目的终端显示行
 * 
 * @param {object} project - 项目对象
 * @returns {string} 格式化后的输出文本行
 */
function formatProject(project) {
    const id = String(project.id).padEnd(3, ' ');
    const name = String(project.name).padEnd(24, ' ');
    const alias = String(project.alias || '').padEnd(20, ' ');
    return `${id} ${name} ${alias} pnpm demo ${project.alias || project.id}`;
}

const projects = scanProjects();
const groups = groupByCategory(projects);

Object.keys(groups).forEach(category => {
    // 适配中文长度对下划线进行格式化
    console.log(`\n${category}`);
    console.log('-'.repeat(category.length * 2));
    groups[category].forEach(project => console.log(formatProject(project)));
});

console.log('\n使用方式：pnpm demo 或 pnpm demo <编号/别名/关键词>');

