import axios from "axios";
import { axiosConfig } from "./config";
import { ElMessage } from "element-plus";
import {
  handleRequestHeader,
  handleAuth,
  handleAuthError,
  handleGeneralError,
  handleNetworkError,
} from "@/utils/tools";
import router from "@/router";
import { userApi } from "@/api/user";
import { useAuthStore } from "@/stores/user";

// 判断是否是正式环境
const isProd = () => import.meta.env.VITE_APP_ENV === "production";
// console.log(import.meta.env.VITE_APP_ENV);
const { baseURL_dev, baseURL_prod, timeout, withCredentials } = axiosConfig;

// 创建axios实例
const axiosService = axios.create({
  baseURL: isProd() ? baseURL_prod : baseURL_dev,
  timeout,
  withCredentials,
});

// 添加 refreshToken 方法
async function refreshToken() {
  // 此处添加你的刷新令牌逻辑，例如：
  const authStore = useAuthStore();
  const refresh_token = authStore.refresh_token;
  const [e, r] = await userApi.refreshToken({ refresh_token });
  if (!e && r?.access_token && r?.refresh_token) {
    authStore.setToken({
      // 更新为调用 setTokens，传递 access token 和 refresh token
      accessToken: r.access_token,
      refreshToken: r.refresh_token,
    });
  } else {
    authStore.logout();
  }
  return r.access_token;
}

axiosService.interceptors.request.use((config) => {
  config = handleRequestHeader(config) || {};
  config = handleAuth(config) || {};
  return config;
});

axiosService.interceptors.response.use(
  (response) => {
    if (response.status !== 200) return Promise.reject(response.data);
    handleAuthError(response.data.errno);
    handleGeneralError(response.data.errno, response.data.errmsg);
    console.log(response);
    return response;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        // 尝试刷新令牌
        const newAccessToken = await refreshToken();
        originalConfig.headers["Authorization"] = "Bearer " + newAccessToken;
        // 用新的 access token 重试原始请求
        return axiosService(originalConfig);
      } catch (refreshErr) {
        // 刷新令牌失败，处理登录逻辑，例如重定向到登录页
        ElMessage({
          message: "会话已过期，请重新登录。",
          type: "error",
        });
        router.replace("/login").catch((err) => {
          // 处理在尝试导航到当前位置时发生的错误
          console.error("Router navigation error:", err);
        });
        return Promise.reject(refreshErr);
      }
    }
    handleNetworkError(err.response ? err.response.status : null);
    return Promise.reject(err);
  }
);

export const Get = (url, params = {}, clearFn) =>
  new Promise((resolve) => {
    axiosService
      .get(url, { params })
      .then((result) => {
        let res;
        if (clearFn !== undefined) {
          res = clearFn(result.data);
        } else {
          res = result.data;
        }
        resolve([null, res]);
      })
      .catch((err) => {
        resolve([err, undefined]);
      });
  });

export const Post = (url, data, params = {}) => {
  return new Promise((resolve) => {
    // 检查是否有 onUploadProgress 的配置，并在没有提供时设置一个默认函数
    const onUploadProgress =
      params.onUploadProgress ||
      function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // console.log("Upload progress: ", percentCompleted);
      };
    axiosService
      .post(url, data, { ...params, onUploadProgress: onUploadProgress })
      .then((result) => {
        resolve([null, result.data]);
      })
      .catch((err) => {
        resolve([err, undefined]);
      });
  });
};

export const Delete = (url, data, params = {}) => {
  return new Promise((resolve) => {
    axiosService
      .delete(url, data, { params })
      .then((result) => {
        resolve([null, result.data]);
      })
      .catch((err) => {
        resolve([err, undefined]);
      });
  });
};

export const Put = (url, data, params = {}) => {
  return new Promise((resolve) => {
    axiosService
      .put(url, data, { params })
      .then((result) => {
        resolve([null, result.data]);
      })
      .catch((err) => {
        resolve([err, undefined]);
      });
  });
};
