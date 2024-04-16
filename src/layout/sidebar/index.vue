<template>
    <el-menu :default-active="defaultActive" :collapse="isCollapse" text-color="var(--color-sidebar-text)">
        <SidebarItem v-for="route in topRoutes" :key="route.path" :item="route"></SidebarItem>
    </el-menu>
</template>
<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter,RouterView } from 'vue-router';
import SidebarItem from '@/layout/sidebar/SidebarItem.vue';
import { appStore } from '@/stores/app';
const store = appStore();
const router = useRouter();
const currentRoute = useRoute();
const topRoutes = ref([]);
const isDesktop = store.isDesktop
// 使用watchEffect来侦听路由列表的变化，并更新topRoutes
watchEffect(() => {
    topRoutes.value = router.getRoutes().filter((route) => route.meta && route.meta.title && route.meta.isVisible !== false)
    .sort((a, b) => {
            // 根据meta中的order字段来排序，如果没有定义order，默认为0
            const orderA = a.meta.priority || 0;
            const orderB = b.meta.priority || 0;
            return orderA - orderB; // 升序排序
        });
});

const defaultActive = computed(() => {
    return currentRoute.path;
});

const isCollapse = computed(() => {
    return store.sidebarOpened;
});

</script>
<style lang="scss" scoped>
.el-menu {
    background-color:var(--color-sidebar-background);
}
</style>