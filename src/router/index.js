import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    hidden: true,
  },
  {
    path: "/setting",
    name: "Setting",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/setting",
        name: "Setting",
        component: () => import("@/views/setting/index.vue"),
        meta: {
          title: "设置",
          icon: "Setting",
          isIndependent: true,
        },
      },
    ],
  },
  {
    path: "/",
    // name: "MyFiles",
    redirect: "/myfiles/allfiles",
    component: Layout,
    meta: {
      title: "我的文件",
      icon: "Folder",
      menuType: "1",
      isIndependent: true,
      priority: 1,
    },
    children: [
      {
        path: "/myfiles/allfiles",
        name: "AllFiles",
        component: () => import("@/views/myfiles/index.vue"),
        meta: {
          title: "全部文件",
          icon: "Film",
          menuType: "2",
          isIndependent: false,
          priority: 1.1,
        },
      },
      {
        path: "/myfiles/video",
        name: "Video",
        component: () => import("@/views/myfiles/Video/index.vue"),
        meta: {
          title: "视频",
          icon: "Film",
          menuType: "2",
          isIndependent: false,
          priority: 1.2,
        },
      },
      {
        path: "/myfiles/photo",
        name: "Photo",
        component: () => import("@/views/myfiles/Photo/index.vue"),
        meta: {
          title: "图片",
          icon: "Picture",
          menuType: "2",
          isIndependent: false,
          priority: 1.3,
        },
      },
      {
        path: "/myfiles/musics",
        name: "Musics",
        component: () => import("@/views/myfiles/Music/index.vue"),
        meta: {
          title: "音乐",
          icon: "Headset",
          menuType: "2",
          isIndependent: false,
          priority: 1.4,
        },
      },
      {
        path: "/myfiles/document",
        name: "Document",
        component: () => import("@/views/myfiles/Document/index.vue"),
        meta: {
          title: "文档",
          icon: "Document",
          menuType: "2",
          isIndependent: false,
          priority: 1.5,
        },
      },
    ],
  },
  {
    path: "/transfer",
    component: Layout,
    children: [
      {
        path: "trans", // 子路由的路径是相对于父路由的，这里的完整路径是 '/home'
        component: () => import("@/views/transmit/index.vue"), // 懒加载首页组件
        meta: {
          title: "传输列表",
          icon: "Switch",
          menuType: "1",
          isIndependent: true,
          priority: 2,
        }, // 路由元数据，可以存储任意路由相关信息
      },
    ],
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 模式的路由
  routes,
});

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  router.matcher = newRouter.matcher; // reset router
}


export default router;
