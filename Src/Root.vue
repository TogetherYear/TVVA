<script lang="ts" setup>
import AppVue from './App/App.vue';
import TestVue from './Test/Test.vue';
</script>

<template>
    <div class="Root">
        <el-config-provider>
            <AppVue></AppVue>
            <TestVue></TestVue>
        </el-config-provider>
    </div>
</template>

<style lang="scss" scoped></style>
