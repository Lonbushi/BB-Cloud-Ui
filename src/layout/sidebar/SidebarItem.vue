<template>
  <!-- 如果有子路由，渲染el-sub-menu -->
  <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
    <template #title>
      <el-icon v-if="iconComponent">
        <component :is="iconComponent" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <!-- 渲染子路由项 -->
    <sidebar-item v-for="child in item.children" :key="child.path" :item="child"></sidebar-item>
  </el-sub-menu>

  <!-- 如果没有子路由，且menuType为'1'，渲染el-menu-item -->
  <!-- 使用括号确保逻辑正确解析 -->
  <el-menu-item v-if="!item.children || item.children.length === 0 && item.meta.menuType === '1'" :index="item.path"
    @click="navigateTo(item.path)">
    <el-icon v-if="iconComponent">
      <component :is="iconComponent" />
    </el-icon>
    <template #title>{{ item.meta.title }}</template>
  </el-menu-item>
</template>



<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as Icons from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { appStore } from '@/stores/app';
const store = appStore();
const props = defineProps({
  item: Object,
});

const router = useRouter();


// 根据路由配置动态获取图标组件
const iconComponent = computed(() => {
  if (props.item.meta && props.item.meta.icon) {
    const iconName = props.item.meta.icon;
    return Icons[iconName] || null;
  }
  return null;
});

// 路由跳转函数
const navigateTo = (path) => {
  router.push(path);
};
</script>
<style lang="scss" scoped>
.el-menu-item {
  background-color: var(--color-sidebar-background);
  &:hover{
    background-color: var(--el-menu-hover-bg-color);
  }
}
</style>
