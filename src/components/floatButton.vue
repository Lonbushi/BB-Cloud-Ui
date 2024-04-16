<template>
    <el-affix position="bottom" :offset="50">
        <div class="showIcon" @mouseenter="changeIcon(true)" @mouseleave="changeIcon(false)">
            <transition name="fade">
                <div v-show="showCurrent" class="Icon">
                    <span class="content">
                        <!-- <el-button class="button" type="primary" :icon="Folder" round>创建文件夹</el-button> -->
                        <AddFolders></AddFolders>
                    </span>
                    <span class="content">
                        <!-- <span>上传文件</span> -->
                        <!-- <el-button class="button" type="primary" :icon="DocumentAdd" round>上传文件</el-button> -->
                        <upLoadFile />

                    </span>
                    <span class="content">
                        <!-- <span>上传文件夹</span> -->
                        <!-- <el-button class="button" type="primary" :icon="FolderAdd" round>上传文件夹</el-button> -->
                        <upLoadFolder />
                    </span>
                    <span class="content">
                        <!-- <span>上传文件夹</span> -->
                        <!-- <el-button class="button" type="primary" :icon="FolderAdd" round>上传文件夹</el-button> -->
                        <txetUpload />
                    </span>
                </div>
            </transition>
            <el-button size="large" type="primary" :icon="currentIcon" circle />
        </div>
    </el-affix>
</template>
<script setup>
import { ref, shallowRef } from 'vue';
import { Plus, UploadFilled, FolderAdd, DocumentAdd, Folder, Upload } from '@element-plus/icons-vue';
import upLoadFile from '@/components/upLoad/upLoadFile.vue'
import upLoadFolder from '@/components/upLoad/upLoadFolder.vue'
import AddFolders from '@/components/AddFolders.vue';
import txetUpload from '@/components/upLoad/textUpload.vue'
const currentIcon = shallowRef(Plus);
const showCurrent = ref(false); // Initially don't show the options
// 定义改变图标的函数
const changeIcon = (hover) => {
    currentIcon.value = hover ? Upload : Plus; // 如果鼠标悬停，切换为 Edit 图标，否则切回 Plus 图标
    showCurrent.value = hover ? true : false; // 如果鼠标悬停，显示选项，否则隐藏
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

.el-affix {
    right: 3%;

    .showIcon {
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;

        .Icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            bottom: 100%;
            /* Position above the main button */
            padding-bottom: 10px;
            /* Space between the main button */

            .content {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10px;

                .button {
                    width: 120px;
                    height: 30px;
                }
            }
        }
    }

    .el-button--large {
        --el-button-size: 56px;
        font-size: 24px;
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);

        &:hover {
            background-color: rgb(72, 117, 175);
        }
    }
}

.el-button+.el-button {
    margin: 0 !important;
}
</style>
