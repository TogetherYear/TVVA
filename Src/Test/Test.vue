<script lang="ts" setup>
import { TTest } from '@/Decorators/TTest';
import { Test } from './Test';

const { isShow } = Test.InitStates();
const { functionMap, propertyMap } = TTest;
Test.Run();
</script>

<template>
    <div class="Test" v-show="isShow && (functionMap.size !== 0 || propertyMap.size !== 0)">
        <span class="FunctionItem" v-for="f in functionMap" :key="f[0]" @click="Test.OnClickTest(f[1])">{{ f[1].label }}</span>
        <span class="PropertyItem" v-for="p in propertyMap" :key="p[0]">{{ p[1].label }} : {{ p[1].property }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import './Test.scss';
</style>
