// useViewport.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useViewport(threshold = 768) {
  const width = ref(window.innerWidth);

  const updateViewport = () => {
    width.value = window.innerWidth;
  };

  // 返回一个“设置”函数，而不是直接在模块作用域内调用生命周期钩子
  return {
    width,
    setup() {
      onMounted(() => {
        window.addEventListener('resize', updateViewport);
      });

      onUnmounted(() => {
        window.removeEventListener('resize', updateViewport);
      });
    }
  };
}
