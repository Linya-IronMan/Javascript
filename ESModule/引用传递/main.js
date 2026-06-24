import { num } from "./a.js";

// NOTE 会报错 Assignment to constant variable.
// NOTE 此处将 num 看作一个常量，不能被重新赋值。
// num = 2;

setInterval(() => {
	console.log(num);
}, 1000);

/**
 * NOTE 输出 2 4 6 8 10
 */
