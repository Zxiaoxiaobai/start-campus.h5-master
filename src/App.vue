<template>
    <div id="app">
        <router-view/>

    </div>
</template>

<script>
import eruda from 'eruda'
import {onMounted} from "vue";

export default {
    name: 'App',
    setup() {
        const isDev = process.env.VUE_APP_CURRENTMODE === 'development'
        onMounted(() => {
            isDev && eruda.init()
        })
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
