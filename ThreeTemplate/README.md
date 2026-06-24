# README

```ts
// 引入three.js
import * as THREE from "three";
// 引入扩展库OrbitControls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// 引入扩展库GLTFLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
```

# importmap

学习环境中，.html 文件引入 three.js，最好的方式就是参考 threejs 官方案例，通过配置<script type="importmap">,实现学习环境.html 文件和 vue 或 reaact 脚手架开发环境一样的写法。

```html
<!-- 具体路径配置，你根据自己文件目录设置 -->
<script type="importmap">
	{
		"imports": {
			"three": "../../../three.js/build/three.module.js"
		}
	}
</script>

<!-- 配置type="importmap",.html文件也能和项目开发环境一样方式引入threejs -->
<script type="module">
	import * as THREE from "three";
	// 浏览器控制台测试，是否引入成功
	console.log(THREE.Scene);
</script>
```

通过配置<script type="importmap">，让学习环境.html 文件，也能和 vue 或 react 开发环境中一样方式方式引入 threejs 扩展库。

配置 addons/等价于 examples/jsm/。

```html
<script type="importmap">
	{
		"imports": {
			"three": "./three.js/build/three.module.js",
			"three/addons/": "./three.js/examples/jsm/"
		}
	}
</script>

<script type="module">
	// three/addons/路径之后对应的是three.js官方文件包`/examples/jsm/`中的js库
	// 扩展库OrbitControls.js
	import { OrbitControls } from "three/addons/controls/OrbitControls.js";
	// 扩展库GLTFLoader.js
	import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
	console.log(OrbitControls);
	console.log(GLTFLoader);
</script>
```

# Parcel + TypeScript

1. 全局安装 parcel
2. 在 html 文件中直接引入 ts 文件，注意：script 标签需要加上 type="module"
3. 通过 parcel 启动 index.html: `parcel index.html`
