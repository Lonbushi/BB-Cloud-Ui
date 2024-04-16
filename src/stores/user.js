// store/auth.js
import { defineStore } from "pinia";
import { userApi } from "@/api/user"; // 确保正确导入 userApi
export const useAuthStore = defineStore("auth", {
  state: () => ({
    access_token: null,
    refresh_token: null,
    userInfo: null, // 添加一个新的状态来存储用户信息
  }),
  getters: {
    isLoggedIn: (state) => !!state.access_token,
    getUserInfo: (state) => state.userInfo, // 添加一个新的 getter 来获取用户信息
  },
  actions: {
    setToken({ accessToken, refreshToken }) {
      this.access_token = accessToken;
      this.refresh_token = refreshToken;
    },
    clearAuthData() {
      this.access_token = null;
      this.refresh_token = null;
      this.userInfo = null;
    },
    logout() {
      this.clearAuthData();
    },
    initializeStore() {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (accessToken && refreshToken) {
        this.setToken({ accessToken, refreshToken });
      }
    },
    // 新 action：获取并存储用户信息
    async fetchUserInfo() {
      const [e, r] = await userApi.getUserInfo();
      if (r) {
        this.userInfo = r;
      } else {
        this.logout();
      }
    },
  },
  persist: {
    paths: ["access_token", "refresh_token"],
  }, // 开启持久化
});
