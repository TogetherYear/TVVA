<script lang="ts" setup>
import { TTest } from '@/Decorators/TTest';
import { Test } from './Test';

const { isShow } = Test.InitStates();
const { functionMap, propertyMap, memory } = TTest;
Test.Run();
</script>

<template>
    <div class="Test" v-show="isShow && (functionMap.size !== 0 || propertyMap.size !== 0)">
        <span class="Memory">
            <span class="Item"> Limit {{ memory.jsHeapSizeLimit }} MB </span>
            <span class="Item"> Allocated {{ memory.totalJSHeapSize }} MB </span>
            <span class="Item"> Used {{ memory.usedJSHeapSize }} MB </span>
        </span>
        <span class="FunctionItem" v-for="f in functionMap" :key="f[0]" @click="TTest.EmitTest(f[1])">{{ f[1].label }}</span>
        <span class="PropertyItem" v-for="p in propertyMap" :key="p[0]">{{ p[1].label }} : {{ p[1].property }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import './Test.scss';
</style>
