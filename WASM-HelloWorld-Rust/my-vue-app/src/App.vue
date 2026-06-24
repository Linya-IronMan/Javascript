<template>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
</template>
<script setup>
import HelloWorld from './components/HelloWorld.vue';
import init, { hello_world, User, More } from '../pkg/my_rust_wasm';
import { onMounted } from 'vue';

onMounted(() => {
    init().then(() => {
        const more = new More(18, 'female', ['lisa']);
        const user = new User('张雅昕', more);
        console.log(typeof more);
        console.log(hello_world(user));
    });
});
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
