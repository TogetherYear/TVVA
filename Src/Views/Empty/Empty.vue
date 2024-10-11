<script lang="ts" setup>
import { Empty } from './Empty';
const instance = new Empty();

const {} = instance.InitStates();

instance.Run();
</script>

<template>
    <div class="Empty">
        <span class="Title">404</span>
    </div>
</template>

<style lang="scss" scoped>
@import './Empty.scss';
</style>
