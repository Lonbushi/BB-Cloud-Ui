<template>
    <el-space direction="vertical" style="width: 100%;">
        <el-card>
            <template #header>
                <div>
                    个人资料
                </div>
            </template>

            <div class="content-style">
                <div class="frist">
                    <el-avatar :size="40" :src="circleUrl" style="max-width: 40px; width: 40px;" />
                    <span class="text">头像</span>
                </div>
                <el-icon>
                    <ArrowRight />
                </el-icon>
            </div>
            <div class="content-style">
                <div class="frist">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span class="text">名字</span>
                </div>
                <div class="end">
                    <span class="content-text">{{ authStore.getUserInfo.nick_name }}</span>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
            </div>
            <div class="content-style">
                <div class="frist">
                    <el-icon>
                        <Message />
                    </el-icon>
                    <span class="text">邮箱</span>
                </div>
                <div class="end">
                    <span class="content-text">{{ authStore.getUserInfo.email }}</span>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
            </div>
            <div class="content-style">
                <div class="frist">
                    <el-icon>
                        <Message />
                    </el-icon>
                    <span class="text">手机号</span>
                </div>
                <div class="end">
                    <span class="content-text">{{ authStore.getUserInfo.phone_num }}</span>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
            </div>
        </el-card>
        <el-card>
            <template #header>
                <div>
                    个性化
                </div>
            </template>
            <div class="content-style">
                <div class="frist">
                    <el-icon>
                        <Brush />
                    </el-icon>
                    <span class="text">主题配色</span>
                </div>
                <div class="end">
                    <el-color-picker v-model="themeColor" show-alpha :predefine="predefineColors"
                        @change="handleChange" />
                </div>
            </div>
            <div class="content-style">
                <div class="frist">
                    <el-icon>
                        <EditPen />
                    </el-icon>
                    <span class="text">字体配色</span>
                </div>
                <div class="end">
                    <el-color-picker v-model="themeColorText" show-alpha :predefine="predefineColors"
                        @change="handleChangeText" />
                </div>
            </div>
            <div class="content-style">
                <div class="frist">
                    <el-icon>
                        <Moon />
                    </el-icon>
                    <span class="text">暗黑模式</span>
                </div>
                <div class="end">
                    <el-switch @click="openMode" v-model="mode" style="margin: 5px;"></el-switch>
                </div>
            </div>
        </el-card>
    </el-space>
</template>
<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/user'
import { ArrowRight, User, Message, Brush, EditPen, Moon } from '@element-plus/icons-vue'
import { appStore } from "@/stores/app";
const store = appStore();
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
const themeColorText = computed({
  get: () => store.themeColorText,

  set: (newValue) => {
    store.themeColorText = newValue
  }
});
const mode = computed({
  get: () => store.switchColor,

  set: (newValue) => {
    store.setSwitchColor = newValue
  }
});
const authStore = useAuthStore()
const themeColor = computed({
  get: () => store.themeColor,

  set: (newValue) => {
    store.themeColor = newValue 
  }
});
const circleUrl = authStore.getUserInfo.avatar ? authStore.getUserInfo.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
const handleChange = (val) => {
    store.updateThemeColor(val)
}
const handleChangeText = (val) => {
    store.updateThemeColorText(val)
}
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
const openMode = () => {
    store.toggleTheme();
    store.toggleSwitchColor()
}
</script>
<style lang="scss" scoped>
.el-icon {
    font-size: 1.2rem;
    color: var(--color-icon);
}

.el-card {
    width: 30vw;
    margin: 10px 0;
    background-color: var(--color-card);
    color: var(--color-card-text);

    ::v-deep(.el-card__body) {
        padding: 0;

        .content-style {
            width: 93%;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: solid 1px #ccc;
            cursor: pointer;
            padding: 0 20px;

            &:hover {
                background-color: #ac9f9f;
            }

            .frist {
                width: 50%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .el-icon {
                    width: 40px;
                    max-width: 40px;
                }
            }

            .end {
                display: flex;
                align-items: center;

                .el-icon {
                    margin-left: 10px;
                }

                .color {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                }

                .color.left {
                    background-color: var(--color-background);
                }

                .color.right {
                    background-color: var(--color-text);
                }
                .el-color-picker{
                    margin-right: 10px;
                }

            }

            .text {
                width: 70%;
                font-size: 14px;
                margin-left: 10px;
                max-width: 100px;
            }
        }
    }

}

@media (max-width: 640px) {
    .el-card {
        width: 340px;
    }

    .content-style {
        padding: 0 10px;
    }
    .content-text{
        font-size: 14px;
    }
}
</style>