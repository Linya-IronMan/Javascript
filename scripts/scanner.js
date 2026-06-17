const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', '.idea', '.vscode', 'node_modules', 'dist', 'coverage', 'docs', 'scripts']);
const runnableScriptNames = ['start'];

function toKebabCase(str) {
    return str
        .replace(/：/g, '-')
        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}

function readJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.warn(`[Scanner Warning] 无法解析 ${path.relative(rootDir, filePath)}: ${error.message}`);
        return null;
    }
}

function findPackageJsonFiles(dirPath, result = []) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    entries.forEach(entry => {
        const currentPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (!ignoredDirs.has(entry.name)) {
                findPackageJsonFiles(currentPath, result);
            }
            return;
        }

        if (entry.isFile() && entry.name === 'package.json' && currentPath !== path.join(rootDir, 'package.json')) {
            result.push(currentPath);
        }
    });

    return result;
}

function getRunnableScript(scripts = {}) {
    return runnableScriptNames.find(scriptName => scripts[scriptName]);
}

function getNearestNumberedSegment(relativeDir) {
    const segments = relativeDir.split(path.sep);
    return segments.find(segment => /^\d+[-：]/.test(segment)) || '';
}

function deriveId(relativeDir, packageName) {
    const numberedSegment = getNearestNumberedSegment(relativeDir);
    const matched = numberedSegment.match(/^(\d+)[-：]/);
    return matched ? matched[1] : toKebabCase(packageName || relativeDir);
}

function deriveName(relativeDir, packageJson) {
    if (packageJson.demoName) return packageJson.demoName;

    const numberedSegment = getNearestNumberedSegment(relativeDir);
    if (numberedSegment) {
        return numberedSegment.replace(/^\d+[-：]/, '');
    }

    return packageJson.name || path.basename(relativeDir);
}

function deriveCategory(relativeDir, packageJson) {
    if (packageJson.demoCategory) return packageJson.demoCategory;

    const id = parseInt(deriveId(relativeDir, packageJson.name), 10);
    const lowerPath = relativeDir.toLowerCase();

    if (!Number.isNaN(id)) {
        if ([1, 2, 3, 4, 5, 18, 36].includes(id)) return 'Promise / 异步';
        if ([6].includes(id)) return '网络与跨域';
        if ([7, 8, 10, 11, 12, 13, 14, 15, 31].includes(id) || lowerPath.includes('esmodule')) return 'JavaScript 语言机制';
        if ([9, 22, 29, 30, 33, 34].includes(id)) return 'DOM 与样式';
        if ([16, 19, 25].includes(id)) return '设计模式';
        if ([20, 21, 26, 27, 32, 35, 37].includes(id)) return '工具函数 / 数据结构';
        if ([28, 40].includes(id)) return '图形与跨语言';
    }

    if (lowerPath.includes('webcomponent') || lowerPath.includes('vue') || lowerPath.includes('lit') || lowerPath.includes('inversify') || lowerPath.includes('kor-copy')) {
        return '框架与组件';
    }

    return '未分类';
}

function createProjectFromPackage(packageJsonPath) {
    const packageDir = path.dirname(packageJsonPath);
    const relativeDir = path.relative(rootDir, packageDir) || '.';
    const packageJson = readJson(packageJsonPath);

    if (!packageJson) return null;

    const scripts = packageJson.scripts || {};
    const runnableScript = getRunnableScript(scripts);

    if (!runnableScript) return null;

    const name = deriveName(relativeDir, packageJson);
    const alias = packageJson.demoAlias || toKebabCase(packageJson.name || name || relativeDir);
    const readmePath = path.join(packageDir, 'README.md');

    return {
        id: String(packageJson.demoId || deriveId(relativeDir, packageJson.name)),
        name,
        alias,
        path: relativeDir,
        category: deriveCategory(relativeDir, packageJson),
        description: packageJson.description || `项目 ${name} 的原生特性演练`,
        tags: packageJson.demoTags || [],
        readme: fs.existsSync(readmePath) ? path.join(relativeDir, 'README.md') : '',
        packageName: packageJson.name || '',
        script: runnableScript,
        scripts,
    };
}

function scanProjects() {
    return findPackageJsonFiles(rootDir)
        .map(createProjectFromPackage)
        .filter(Boolean)
        .sort((a, b) => {
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);

            if (Number.isNaN(idA) && Number.isNaN(idB)) return a.path.localeCompare(b.path);
            if (Number.isNaN(idA)) return 1;
            if (Number.isNaN(idB)) return -1;
            if (idA !== idB) return idA - idB;
            return a.path.localeCompare(b.path);
        });
}

module.exports = scanProjects;
