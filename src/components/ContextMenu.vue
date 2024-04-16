<template>
    <Teleport to="body">
      <div v-if="visible" class="context-menu" :style="menuPositionStyle">
        <ul>
          <li v-for="(item, index) in items" :key="index" @click="() => menuAction(item.action)">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // 定义传入的 props
  const props = defineProps({
    visible: Boolean,
    position: Object,
    items: Array,
  });
  
  // 定义 emit 事件
  const emit = defineEmits(['menuAction']);
  
  // 计算属性用于设置菜单的位置
  const menuPositionStyle = computed(() => ({
    top: `${props.position.y}px`,
    left: `${props.position.x}px`,
  }));
  
  // 菜单操作方法
  const menuAction = (action) => {
    emit('menuAction', action);
  };
  </script>
  
  <style scoped>
  .context-menu {
    position: absolute;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-size: 12px;
  }
  
  .context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .context-menu ul li {
    padding: 8px 12px;
    cursor: pointer;
  }
  
  .context-menu ul li:hover {
    background-color: #f0f0f0;
  }
  </style>
  