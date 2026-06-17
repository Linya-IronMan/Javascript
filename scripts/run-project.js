const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const scanProjects = require('./scanner');

const rootDir = path.resolve(__dirname, '..');
const MAX_VISIBLE_MATCHES = 8;

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function getSearchText(project) {
    return [
        project.id,
        project.name,
        project.alias,
        project.path,
        project.category,
        project.description,
        ...(project.tags || []),
    ]
        .map(normalize)
        .join(' ');
}

function findExactMatch(projects, keyword) {
    const value = normalize(keyword);
    return projects.find(project => {
        return [project.id, project.alias, project.name].some(item => normalize(item) === value);
    });
}

function findFuzzyMatches(projects, keyword) {
    const value = normalize(keyword);
    if (!value) return [];
    return projects.filter(project => getSearchText(project).includes(value));
}

function formatProject(project, selected) {
    const marker = selected ? '>' : ' ';
    const id = String(project.id).padEnd(3, ' ');
    const name = String(project.name).padEnd(24, ' ');
    const alias = String(project.alias || '').padEnd(24, ' ');
    return `${marker} ${id} ${name} ${alias} ${project.category}`;
}

function clearScreen() {
    process.stdout.write('\x1Bc');
}

function renderSearch(projects, keyword, selectedIndex) {
    clearScreen();

    const matches = findFuzzyMatches(projects, keyword).slice(0, MAX_VISIBLE_MATCHES);

    console.log('实时模糊检索 JavaScript 小项目');
    console.log('输入关键词实时搜索，↑/↓ 选择，Enter 启动，Esc 或 Ctrl+C 退出。');
    console.log('');
    console.log(`搜索：${keyword || ''}`);
    console.log('');

    if (!keyword) {
        console.log('请输入项目编号、别名、名称、分类或关键词。');
        return matches;
    }

    if (matches.length === 0) {
        console.log('没有匹配项目，请继续输入其他关键词。');
        return matches;
    }

    matches.forEach((project, index) => {
        console.log(formatProject(project, index === selectedIndex));
    });

    return matches;
}

function createInteractiveSearch(projects) {
    return new Promise(resolve => {
        let keyword = '';
        let selectedIndex = 0;
        let matches = renderSearch(projects, keyword, selectedIndex);

        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        function cleanup(project) {
            process.stdin.removeListener('keypress', onKeypress);
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }
            process.stdin.pause();
            clearScreen();
            resolve(project || null);
        }

        function refresh() {
            matches = renderSearch(projects, keyword, selectedIndex);
            if (selectedIndex >= matches.length) {
                selectedIndex = Math.max(matches.length - 1, 0);
                matches = renderSearch(projects, keyword, selectedIndex);
            }
        }

        function onKeypress(str, key) {
            if (key && key.ctrl && key.name === 'c') {
                cleanup(null);
                return;
            }

            if (key && key.name === 'escape') {
                cleanup(null);
                return;
            }

            if (key && key.name === 'return') {
                if (matches[selectedIndex]) {
                    cleanup(matches[selectedIndex]);
                }
                return;
            }

            if (key && key.name === 'up') {
                if (matches.length > 0) {
                    selectedIndex = (selectedIndex - 1 + matches.length) % matches.length;
                    refresh();
                }
                return;
            }

            if (key && key.name === 'down') {
                if (matches.length > 0) {
                    selectedIndex = (selectedIndex + 1) % matches.length;
                    refresh();
                }
                return;
            }

            if (key && key.name === 'backspace') {
                keyword = keyword.slice(0, -1);
                selectedIndex = 0;
                refresh();
                return;
            }

            if (key && key.name === 'space') {
                keyword += ' ';
                selectedIndex = 0;
                refresh();
                return;
            }

            if (str && !key.ctrl && !key.meta && str >= ' ') {
                keyword += str;
                selectedIndex = 0;
                refresh();
            }
        }

        process.stdin.on('keypress', onKeypress);
    });
}

function getCommand(project) {
    if (!project.script) {
        throw new Error(`项目 ${project.name} 没有可执行脚本，请在 package.json 中配置 start`);
    }

    return {
        command: 'pnpm',
        args: ['--dir', project.path, 'start'],
    };
}

function runProject(project) {
    const commandInfo = getCommand(project);
    const commandText = [commandInfo.command, ...commandInfo.args].join(' ');

    console.log(`启动项目：${project.id} ${project.name}`);
    console.log(`项目说明：${project.description}`);
    console.log(`执行命令：${commandText}`);
    console.log('');

    const child = spawn(commandInfo.command, commandInfo.args, {
        cwd: rootDir,
        stdio: 'inherit',
        shell: Boolean(commandInfo.shell),
    });

    child.on('exit', code => {
        process.exit(code || 0);
    });
}

async function main() {
    const projects = scanProjects();
    const keyword = process.argv.slice(2).join(' ').trim();

    if (!keyword) {
        const selectedProject = await createInteractiveSearch(projects);
        if (selectedProject) runProject(selectedProject);
        return;
    }

    const exactMatch = findExactMatch(projects, keyword);
    if (exactMatch) {
        runProject(exactMatch);
        return;
    }

    const matches = findFuzzyMatches(projects, keyword);
    if (matches.length === 1) {
        runProject(matches[0]);
        return;
    }

    const selectedProject = await createInteractiveSearch(projects);
    if (selectedProject) runProject(selectedProject);
}

main().catch(error => {
    console.error(error.message);
    process.exit(1);
});
