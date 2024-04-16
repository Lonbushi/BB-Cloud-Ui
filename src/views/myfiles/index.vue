<template>
    <el-card>
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{
            name: 'AllFiles', // 假设你的路由名称是 'AllFiles'
            query: {
                path: breadcrumbList.name,
                id: breadcrumbList.id
            }
        }" v-for="(folder, index) in breadcrumbList.path" :key="index">{{ folder }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </el-card>

    <div class="file-body" @click="clearSelection" @contextmenu.prevent="openBlankAreaMenu">
        <div class="file" v-for="(folder, index) in folderList" :key="index"
            @contextmenu.prevent="openContextMenu($event, folder)" @click="selectFolderLeft($event, folder)"
            :class="{ 'selected': selectedFolder === folder }" @dblclick="openFolder(folder)">
            <img class="filer-icon" src="@/assets/file.svg" alt="">
            <span v-if="!isRenaming || selectedFolder !== folder">{{ folder.name }}</span>
            <el-input v-else v-model="folder.name" @blur="finishRenaming" @keyup.enter="finishRenaming"
                style="width: 70%; height: 15px; font-size: 12px;text-align: center;"></el-input>
        </div>
        <Teleport to="body">
            <ContextMenu v-if="menuVisible" :visible="menuVisible" :position="menuPosition" :items="currentMenuItems"
                @menuAction="handleMenuAction" />
        </Teleport>

    </div>
</template>

<script setup>
import { reactive, ref, nextTick, watchEffect, watch, computed, onMounted } from 'vue';
import { handleFolderMenuAction } from '@/utils/folder/folderActions';
import { ArrowRight } from '@element-plus/icons-vue'
import ContextMenu from '@/components/ContextMenu.vue';
import { useRouter, useRoute } from 'vue-router';
import { useFolderStore } from '@/stores/folder'
const folderStore = useFolderStore();
const router = useRouter();
const route = useRoute();
const isRenaming = ref(false);
const menuVisible = ref(false); // 右键菜单是否显示
const menuPosition = reactive({ x: 0, y: 0 })
const selectedFolder = ref(null);
const folderId = computed(() => route.query.id);
const currentMenuItems = ref(null)
// 使用 computed 属性来从 store 中获取文件夹信息，并过滤出当前目录下的文件夹
// 直接使用 computed 跟踪文件夹信息的变化
const folderInfo = computed(() => folderStore.getFolderInfo);
const menuItems = ref([
    { label: '打开', action: 'open' },
    { label: '删除', action: 'delete' },
    { label: '重命名', action: 'rename' },
    // 添加更多菜单项...
]);
const blankAreaMenuItems = ref([
    { label: '新建文件夹', action: 'createFolder' },
    { label: '刷新', action: 'refresh' },
    // 可以根据需要添加更多菜单项
]);
onMounted(async () => {
    await folderStore.fetchFolderInfo(folderId.value)
})
const folderList = computed(() => {
    if (folderId.value == null) {
        return folderInfo.value
    } else {
        return folderInfo.value[0].children
    }
})

watch(folderId, async (newFolderId) => {
    await folderStore.fetchFolderInfo(newFolderId)
})

function removeLastRouteSegment(breadcrumb) {
    // 分割路径字符串，移除空字符串（可能由路径开头的 '/' 导致）
    const segments = breadcrumb.path.split('/').filter(Boolean)
    return {
        name: breadcrumb.name,  // 直接使用从参数提取的 name
        id: breadcrumb.parent,      // 直接使用从参数提取的 id
        path: segments
    }
}

// 面包屑路由列表
const breadcrumbList = computed(() => {
    const breadcrumb = folderInfo.value[0]
    const targetObject = {
        path: ["全部文件"]
    };
    if (folderId.value == null) {
        return targetObject
    } else {
        const path1 = removeLastRouteSegment(breadcrumb)
        const path2 = [...targetObject.path, ...path1.path]
        path1.path = path2;
        return path1;
    }
})


const selectFolder = folder => selectedFolder.value = folder;
const selectFolderLeft = (event, folder) => {
    event.stopPropagation(); // 阻止事件冒泡
    selectFolder(folder)
}
const openContextMenu = (event, folder) => {
    event.preventDefault();
    event.stopPropagation(); // 阻止事件冒泡
    menuPosition.x = event.clientX;
    menuPosition.y = event.clientY;
    menuVisible.value = true;
    selectedFolder.value = folder;
    currentMenuItems.value = menuItems.value; // 使用文件夹相关的菜单项
    stopEventPropagation(event);
};

const stopEventPropagation = (event) => {
    window.addEventListener('click', () => {
        menuVisible.value = false;
    }, { once: true });
};
const openBlankAreaMenu = (event) => {
    event.preventDefault();
    menuPosition.x = event.clientX;
    menuPosition.y = event.clientY;
    menuVisible.value = true;
    selectedFolder.value = null;
    currentMenuItems.value = blankAreaMenuItems.value; // 使用空白区域的菜单项
    stopEventPropagation(event);
};

// 打开文件夹
const openFolder = (folder) => {
    router.push({ name: 'AllFiles', query: { path: folder.name, id: folder.id } });
};

const clearSelection = () => {
    if (!isRenaming.value) selectedFolder.value = null;
};
// 更新 isRenaming 的函数
const updateIsRenaming = (newValue) => {
  isRenaming.value = newValue;
};

const handleMenuAction = async (action) => {
    switch (action) {
        case 'createFolder':
            if (!selectedFolder.value) { // 仅在空白区域右键时允许创建新文件夹
                await handleFolderMenuAction(action, { folderId: folderId.value }); // 调用创建文件夹的函数
            }
            break;
        case 'rename':
        case 'open':
        case 'delete':
            if (selectedFolder.value) { // 确保有选中的文件夹
                handleFolderMenuAction(action,{ selectedFolder: selectedFolder.value, isRenaming: isRenaming.value,openFolder: openFolder,updateIsRenaming }); // 处理文件夹相关的操作
            }
            break;
        default:
            console.warn(`未知操作: ${action}`);
    }
    menuVisible.value = false;
};


// 完成重命名
const finishRenaming = () => {
    // 这里可以添加对新名称的验证逻辑
    isRenaming.value = false;
};


</script>

<style lang="scss" scoped>
.el-card {
    height: 53px;
    z-index: 10px;
    display: flex;
    align-items: center;
}

.file-body {
    width: 100%;
    height: calc(100% - 55px);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .file {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        font-size: 0.75rem;
        color: var(--color-sidebar-text);
        width: 100px;
        height: 100px;
        margin-right: 5px;
        justify-content: center;
        text-align: center;
        margin: 10px;

        .filer-icon {
            width: 4rem;
            height: 4rem;
        }

        &:hover {
            background-color: var(--el-menu-hover-bg-color);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        &.selected {
            background-color: var(--el-menu-hover-bg-color);
            /* 选中文件夹的背景颜色 */
            border: 1px solid #5b9bd5;
            /* 选中文件夹的边框颜色 */
            border-radius: 10px;
            /* 可选：为选中的文件夹添加圆角 */
        }
    }

}
</style>
