<template>
    <el-dialog v-model="dialogVisible" title="Warning" width="400" :modal=false align-center >
        <template #header>
            <span class="dialog-title">登录</span>
        </template>
        <el-form class="mt-4" :model="form" label-width="auto">
            <el-form-item >
                <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User"  />
            </el-form-item>
            <el-form-item >
                <el-input v-model="form.password" placeholder="请输入密码" type="password" autocomplete="off"
                    show-password :prefix-icon="Lock" />
            </el-form-item>
            <el-checkbox v-model="checked3" label="记住密码" />
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button  type="primary" @click="submit" round size="large">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script  setup>
import {api} from '@/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/user'
import { User, Lock } from '@element-plus/icons-vue'
const router = useRouter()
let dialogVisible = ref(false)
const checked3 = ref(false)
const useStore = useAuthStore()
const form = ref({
    username: "",
    password: ""
})
defineExpose({
    dialogVisible
})
const props = defineProps({
    dialogType: {
        type: String,
        default: ""
    }
})
const submit = async () => {
    // 尝试登录
    const [e, r] = await api.Login(form.value);
    console.log(r);

    if (!e && r?.access_token && r?.refresh_token) { // 确保同时获取了 access token 和 refresh token
        useStore.setToken({ // 更新为调用 setTokens，传递 access token 和 refresh token
            accessToken: r.access_token,
            refreshToken: r.refresh_token
        });

        dialogVisible.value = false; // 假设这是关闭登录对话框的逻辑
        router.push('/'); // 导航到首页或其他页面

        ElMessage({ // 显示登录成功的消息
            message: '登录成功！欢迎回来。',
            type: 'success',
            duration: 5000,
        });
    } else {
        // 登录失败的处理
        console.error('Login failed:', e);
        ElMessage({ // 显示登录失败的消息
            message: '登录失败，请检查您的用户名和密码。',
            type: 'error',
            duration: 5000,
        });
    }
};


</script>

<style lang="scss" scoped>
@import '@/styles/main.scss';
.dialog-title{
    margin-left: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: large;
}
.el-input {
    --el-input-bg-color: transparent;
    // padding: 0 20px;
}

.el-input__inner {
    color: $light;
}

.el-form-item__label {
    color: #fff;
}
.dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    .el-button{
        background-color: $main-text-color;
        width: 100%;
    }
}
</style>