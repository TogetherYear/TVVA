<script lang="ts" setup>
import { provide } from 'vue';
import { Application } from './Application';

const instance = new Application();

provide('instance', instance);

const {} = instance.InitStates();

instance.Run();
</script>

<template>
    <div class="Application"><h1 :style="{ color: '#ff0000' }">AAAA</h1></div>
</template>

<style lang="scss" scoped>
@import './Application.scss';
</style>
