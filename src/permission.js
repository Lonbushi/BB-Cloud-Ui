import router from "./router";
import { useAuthStore } from "./stores/user"; // 假设你的 Pinia 用户 store 文件名为 user.js
import { ElMessage } from "element-plus";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start(); // 启动进度条

  const authStore = useAuthStore();
  const hasAccessToken = authStore.access_token; // 从 Pinia store 获取 access token
  const hasRefreshToken = authStore.refresh_token; // 从 Pinia store 获取 refresh token
  const hasGetUserInfo = authStore.userInfo; // 从 authStore 获取用户信息

  if (hasAccessToken) {
    if (to.path === "/login") {
      next({ path: "/" }); // 如果已登录且目标路由是登录页，则重定向到首页
      NProgress.done(); // 立即结束进度条
    } else {
      if (hasGetUserInfo) {
        next(); // 如果已经获取了用户信息，则直接放行
      } else {
        try {
          // 获取用户信息
          await authStore.fetchUserInfo(); // 假设在 authStore 中有一个 fetchUserInfo 的 action 来获取用户信息
          next();
        } catch (error) {
          await handleTokenRefreshOrRedirect(next, to);
        }
      }
    }
  } else if (hasRefreshToken) {
    await handleTokenRefreshOrRedirect(next, to);
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

async function handleTokenRefreshOrRedirect(next, to) {
  const authStore = useAuthStore();
  try {
    await authStore.refreshToken(); // 尝试使用 refresh token 刷新 access token
    next({ path: to.fullPath }); // 刷新成功，重试原路由
  } catch (refreshError) {
    // 刷新失败，重定向到登录页
    authStore.logout();
    ElMessage({
      // 显示登录成功的消息
      message: "会话已过期,请重新登录。",
      type: "error",
      duration: 5000,
    });
    next(`/login?redirect=${to.path}`);
    NProgress.done();
  }
}

router.afterEach(() => {
  NProgress.done(); // 在每次路由导航结束后结束进度条
});
