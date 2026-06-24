export const getType = (target: any) => {
    // NOTE: split 转换成数字会增加消耗成本
    // 能在字符串上做就在字符串上做
    // return Object.prototype.toString.call(target).split(' ')[1].slice(0, -1);

    // 推荐：
    const originType = Object.prototype.toString.call(target);
    const typeIndex = originType.indexOf(' ');
    return originType.slice(typeIndex + 1, -1).toLowerCase();
};

console.info(getType(1)); // Number
