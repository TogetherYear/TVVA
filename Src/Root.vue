<script lang="ts" setup>
import AppVue from './App/App.vue';
import TestVue from './Test/Test.vue';
</script>

<template>
    <van-config-provider>
        <AppVue></AppVue>
        <TestVue></TestVue>
    </van-config-provider>
</template>

<style lang="scss" scoped></style>
