export const visitNode = (n: Node) => {
    if (n instanceof Comment) {
        console.info('Comment node ---', n.textContent);
    }
    if (n instanceof Text) {
        const t = n.textContent?.trim();
        if (t) {
            console.info('Text node ---', t);
        }
    }
    if (n instanceof HTMLElement) {
        console.info('HTMLElement node ---', `<${n.tagName.toLowerCase()}>`);
    }
};

export const depthFirstTraverse = (root: Node) => {
    visitNode(root);

    const childNodes = root.childNodes;

    if (childNodes.length) {
        childNodes.forEach(child => depthFirstTraverse(child));
    }
};

export const depthFirstTraverse2 = (root: Node) => {
    const stack: Node[] = [];
    stack.push(root);
    while (stack.length) {
        const curNode = stack.pop();
        visitNode(curNode);
        const curNodeChilds = curNode.childNodes;
        stack.push(...Array.from(curNodeChilds).reverse());
    }
};

export const breadthFirstTraverse = (root: Node) => {
    const quene: Node[] = [];
    quene.push(root);
    while (quene.length) {
        const curNode = quene.shift();
        if (!curNode) break;
        visitNode(curNode);
        const curNodeChilds = curNode.childNodes;
        quene.push(...curNodeChilds);
    }
};

const root = document.getElementById('box');
console.log('深度优先遍历');
depthFirstTraverse2(root);

// console.info('广度优先遍历');
// breadthFirstTraverse(root);
