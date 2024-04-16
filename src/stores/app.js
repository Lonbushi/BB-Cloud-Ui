import { defineStore } from "pinia";
import { useViewport } from "@/utils/useViewport";

// 辅助函数用于从 localStorage 读取布尔值
function getBooleanFromLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  return storedValue === null ? defaultValue : storedValue === "true";
}

export const appStore = defineStore("app", {
  state: () => {
    // 从 useViewport 获取宽度
    const { width } = useViewport();

    return {
      sidebar: {
        // 使用辅助函数简化读取逻辑
        opened: getBooleanFromLocalStorage("sidebarOpened", true),
        openedPhone: getBooleanFromLocalStorage("sidebarOpenedPhone", false),
      },
      theme: "light",
      width,
      switchColor: false,
      themeColorText: "#fdfdfd",
      themeColor: "#8d4040",
    };
  },
  getters: {
    sidebarOpened: (state) => state.sidebar.opened,
    sidebarOpenedPhone: (state) => state.sidebar.openedPhone,
    isDesktop: (state) => state.width >= 768,
  },
  actions: {
    toggleSidebar() {
      // 根据当前屏幕宽度切换相应的状态
      if (this.isDesktop) {
        this.sidebar.opened = !this.sidebar.opened;
        localStorage.setItem("sidebarOpened", this.sidebar.opened.toString());
      } else {
        this.sidebar.openedPhone = !this.sidebar.openedPhone;
        localStorage.setItem(
          "sidebarOpenedPhone",
          this.sidebar.openedPhone.toString()
        );
      }
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    setSwitchColor(newValue) {
      this.switchColor = newValue;
    },
    toggleSwitchColor() {
      this.switchColor = !this.switchColor;
    },
    updateThemeColor(color) {
      this.themeColor = color;
      document.documentElement.style.setProperty(
        "--color-background-light",
        color
      );
    },
    updateThemeColorText(color) {
      this.themeColorText = color;
      document.documentElement.style.setProperty("--color-text-light", color);
    },
  },
  persist: {
    paths: ["sidebar", "theme", "switchColor", "themeColor", "themeColorText"],
  },
});
