<script lang="ts" setup>
import AppVue from './App/App.vue';
import TestVue from './Test/Test.vue';
</script>

<template>
    <el-config-provider>
        <AppVue></AppVue>
        <TestVue></TestVue>
    </el-config-provider>
</template>

<style lang="scss" scoped></style>
