<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <HeaderView />
            </el-header>
            <el-container>
                <el-aside v-if="isDesktop" width="auto" :class="{ 'is-collapse': !sidebars.opened }">
                    <SideBar></SideBar>
                </el-aside>
                <SidebarPhone v-else></SidebarPhone>
                <el-main>
                    <RouterView />
                    <floatButton class="float-button"></floatButton>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import HeaderView from '@/layout/header/index.vue'
import SideBar from '@/layout/sidebar/index.vue'
import SidebarPhone from '@/layout/sidebar/SidebarPhone.vue';
import floatButton from '@/components/floatButton.vue'
import { appStore } from '@/stores/app';
const appstore = appStore();
const sidebars = appstore.sidebar;
const isDesktop = appstore.isDesktop;
</script>
<style scoped>
.el-header {
    padding: 0 1px;
    height: 64px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    z-index: 10;
    background-color: var(--color-header-background);
;
}

.is-collapse {
    width: 210px;
    overflow-y: auto;
}

.el-menu {
    border-right: none;
}
.el-main{
    position: relative;
    background-color: var(--color-main-background);
    border: solid 1px rgb(199, 205, 212);
    height: calc(100vh - 64px);
    width: 100vw;
    padding: 0;
}
::v-deep(.el-sub-menu.is-active .el-sub-menu__title) {
    border-bottom: solid 1px rgb(199, 205, 212);
}

.el-aside {
    height: calc(100vh - 64px);
    outline-style: solid;
    /* 轮廓线宽度 */
    outline-color: rgb(199, 205, 212);
    outline-width: 1px;
    background-color: var(--color-sidebar-background);
}
.float-button{
    position: fixed;
}
</style>