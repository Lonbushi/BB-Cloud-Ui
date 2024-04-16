<template>
    <el-drawer v-model="drawer" :direction="direction" size="65%" :show-close="false" :with-header="false"
        style="--el-drawer-padding-primary:0;" :close="close">
        <div class="top-box">
            <div class="top-avatar">
                <el-avatar :size="60" :src="circleUrl"></el-avatar>
                <el-switch v-model="value1" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
            </div>
            <div class="top-name">{{ authStore.getUserInfo.nick_name }}</div>
        </div>
        <el-menu :default-active="defaultActive" >
            <SidebarItem v-for="route in topRoutes" :key="route.path" :item="route"></SidebarItem>
        </el-menu>
    </el-drawer>
</template>
<script setup>
import { ref,computed,watchEffect } from 'vue'
import { useAuthStore } from '@/stores/user'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { appStore } from "@/stores/app";
const store = appStore()
const router = useRouter();
const currentRoute = useRoute();
const direction = ref('ltr')
const authStore = useAuthStore()
const circleUrl = authStore.getUserInfo.avatar ? authStore.getUserInfo.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
const value1 = ref(false)
const defaultActive = computed(() => {
    return currentRoute.path;
});
const topRoutes = ref([]);
watchEffect(() => {
    topRoutes.value = router.getRoutes().filter((route) => route.meta && route.meta.title && route.meta.isVisible !== false);
});
const drawer = computed({
  get: () => store.sidebarOpenedPhone,
  set: val => {
    store.toggleSidebar(val); // 假设有这个 action 来更新状态
  }
});

const close = (e) => {
    console.log("关闭了",e);
};
</script>
<style lang="scss" scoped>
.top-box {
    width: 100%;
    height: 150px;
    padding: 20px;
    background-color: antiquewhite;

    .top-avatar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .top-name {
        font-size: 16px;
        margin-top: 20px;
        color: #646262;
        font-weight: 600;
    }
}
</style>