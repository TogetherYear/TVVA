<script lang="ts" setup>
import { App } from './App';

const {} = App.InitStates();
App.Run();
</script>

<template>
    <router-view />
</template>

<style lang="scss">
@import './Root.scss';
@import './App.scss';
</style>
