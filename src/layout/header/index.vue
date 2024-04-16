<script setup>
import { computed, ref, watchEffect } from "vue";
import { Moon, Sunny, Search } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { appStore } from "@/stores/app";
const store = appStore()
const activeIndex = ref('1')
const authStore = useAuthStore()
const router = useRouter()
const circleUrl = authStore.getUserInfo.avatar ? authStore.getUserInfo.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
const isDesktop = store.isDesktop
const handleLogout = () => {
    authStore.logout() // 清除登录状态
    router.push('/login') // 重定向到登录页面
}
const toggleSidebar = () => {
    store.toggleSidebar();
}
const value1 = computed({
  get: () => store.switchColor,

  set: (newValue) => {
    store.setSwitchColor(newValue) ;
  }
});
watchEffect(() => {
    document.documentElement.setAttribute('data-theme', store.theme);
    if (store.theme === 'dark') {
        document.documentElement.style.setProperty('--color-background', 'var(--color-background-dark)');
        document.documentElement.style.setProperty('--color-text', 'var(--color-text-dark)');
    } else {
        document.documentElement.style.setProperty('--color-background', 'var(--color-background-light)');
        document.documentElement.style.setProperty('--color-text', 'var(--color-text-light)');
    }
});

const toggleTheme = () => {
    store.toggleTheme();
    store.toggleSwitchColor()
};
</script>

<template>
    <el-menu :ellipsis="false" :default-active="activeIndex" mode="horizontal" popper-effect="dark">
        <el-menu-item index="0" @click="toggleSidebar">
            <span class="menu-icon iconfont icon-caidan2 "></span>
        </el-menu-item>

        <el-menu-item index="1" @click="activeIndex = '1'">
            <template #title>
                <span class="logo iconfont icon-yunshuju"></span>
                <span class="logo-text">蹦蹦云</span>
            </template>
        </el-menu-item>
        <!-- 搜索框 -->
        <div v-if="isDesktop" class="right-body">
            <!-- 搜索 -->
            <div class="search" style="margin-left: 20px;">
                <el-input type="text" placeholder="搜索.." class="search-box" :prefix-icon="Search"></el-input>
            </div>

            <!-- 用于将后面的元素推到右侧 -->
            <div class="flex-grow"></div>

            <!-- 主题切换 -->
            <el-switch @click="toggleTheme" v-model="value1" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
            <router-link to="/setting">
                <span class="setting iconfont icon-shezhi1"></span>
            </router-link>
            <!-- 设置 -->


            <!-- 用户菜单 -->
            <el-sub-menu class="user" index="user">
                <template #title>
                    <span class="avatar">
                        <el-avatar :size="45" :src="circleUrl"></el-avatar>
                        <span>{{ authStore.getUserInfo.nick_name }}</span>
                    </span>
                </template>

                <el-menu-item index="user-logout" @click="handleLogout">
                    <span>退出登录</span>
                </el-menu-item>
            </el-sub-menu>
        </div>


    </el-menu>

</template>

<style lang="scss" scoped>
.el-menu {
    height: 100%;
    color: var(--color-text);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color: var(--color-background);

    .iconfont {
        font-size: 1.5rem;
        color: var(--color-text);
    }

    .flex-grow {
        flex-grow: 1;
    }

    @media (max-width: 640px) {}

    .logo-text {
        margin-left: 0.5rem;
        color: var(--color-text);
    }

    .search {
        padding-left: 5rem;
        width: 40%;
        display: flex;
        align-items: center;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        background: transparent;

        .el-input {
            transition: width 0.3s ease-in-out;

            width: 35%;

            &:focus-within {
                width: 45%;
            }

        }
    }

    .right-body {
        width: 100%;
        display: flex;
        padding-right: 10px;
        align-items: center;

        .el-switch {
            margin-right: 2rem;
        }

        .setting {
            margin-right: 1rem;
        }

        .user {
            margin-right: 30px;

            .avatar {
                display: flex;
                align-items: center;
                color: var(--color-text);

                .el-avatar {
                    margin-right: 10px;
                }
            }

        }
    }


}

::v-deep(.el-input__wrapper) {
    background-color: #ffffff1c;
    box-shadow: none;
    color: var(--color-text);
    border-radius: 1rem;
}

::v-deep(.el-input__prefix) {
    color: var(--color-text);
}

.el-switch {
    --el-switch-off-color: var(--color-swich);
    --el-switch-on-color: var(--color-swich);
}
</style>