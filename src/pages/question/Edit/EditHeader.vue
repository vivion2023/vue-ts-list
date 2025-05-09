<template>
  <div class="edit-header">
    <div class="header-left">
      <el-link type="primary" class="back-link" @click="() => router.back()"
        >&lt; 返回</el-link
      >
      <div class="title-container">
        <div v-if="isEditTitle" class="title-input">
          <Input
            v-model:value="pageInfo.title"
            size="large"
            @blur="isEditTitle = false"
          />
        </div>
        <div v-else class="title-display">
          <span class="title-text">{{ pageInfo.title }}</span>
          <el-icon :size="16" class="edit-icon" @click="isEditTitle = true">
            <Edit />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="header-mid">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="删除"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div
          class="header-mid-item"
          :class="{ disabled: isLocked }"
          @click="handleDelete"
        >
          <el-icon><Delete /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="隐藏"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div
          class="header-mid-item"
          :class="{ disabled: isLocked }"
          @click="handleHide"
        >
          <el-icon><Hide /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="锁定"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div
          class="header-mid-item"
          :class="{ isLocked: isLocked }"
          @click="handleLock"
        >
          <el-icon><Lock /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="复制"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div class="header-mid-item" @click="handleCopy">
          <el-icon><CopyDocument /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="粘贴"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div
          class="header-mid-item"
          @click="handlePaste"
          :class="{ disabled: !copiedComponent }"
        >
          <el-icon><DocumentCopy /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="上移"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div class="header-mid-item" @click="handleMoveUp">
          <el-icon><ArrowUp /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="下移"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div class="header-mid-item" @click="handleMoveDown">
          <el-icon><ArrowDown /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="撤销"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div
          class="header-mid-item"
          @click="handleUndo"
          :class="{ disabled: !canUndo }"
        >
          <el-icon><RefreshLeft /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="重做"
        placement="bottom"
        :enterable="false"
        :show-after="100"
        :hide-after="100"
      >
        <div
          class="header-mid-item"
          @click="handleRedo"
          :class="{ disabled: !canRedo }"
        >
          <el-icon><RefreshRight /></el-icon>
        </div>
      </el-tooltip>
    </div>
    <div class="header-right">
      <el-button :disabled="loading" class="action-button" @click="handleSave">
        <el-icon v-if="loading" :size="16" class="loading-icon"
          ><Loading
        /></el-icon>
        保存
      </el-button>
      <el-button type="primary" class="action-button" @click="handlePublish"
        >发布</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useGetComponentInfo } from "@/hooks/useGetComponentInfo";
import { useGetPageInfo } from "@/hooks/useGetPageInfo";
import { Input } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { useRequest } from "@/hooks/useRequest";
import { updateQuestionService } from "@/services/question";
import { useEventListener } from "@vueuse/core";
import { useDebounceFn, useRefHistory } from "@vueuse/core";
import cloneDeep from "lodash/cloneDeep";
const store = useStore();
const route = useRoute();
const router = useRouter();
const { pageInfo } = useGetPageInfo();
const isEditTitle = ref(false);
const { selectedId, selectedComponent, copiedComponent } =
  useGetComponentInfo();
const { componentList } = useGetComponentInfo();

const canUndo = computed(() => store.getters["componentsStore/canUndo"]);
const canRedo = computed(() => store.getters["componentsStore/canRedo"]);

const isLocked = computed(() => {
  const component = selectedComponent.value;
  return component ? component.isLocked || false : false;
});

const isHidden = computed(() => {
  const component = selectedComponent.value;
  return component ? component.isHidden || false : false;
});

/*
  @description: 各个按钮的点击事件
*/

// 删除
const handleDelete = () => {
  if (isLocked.value) return;
  store.dispatch("componentsStore/deleteComponent");
};

// 隐藏
const handleHide = () => {
  if (isLocked.value) return;
  store.dispatch("componentsStore/hideComponent", {
    fe_id: selectedId.value,
    isHidden: isHidden.value,
  });
};

// 锁定
const handleLock = () => {
  store.dispatch("componentsStore/lockComponent", {
    fe_id: selectedId.value,
    isLocked: isLocked.value,
  });
};

// 复制
const handleCopy = () => {
  if (isLocked.value) return;
  store.dispatch("componentsStore/copyComponent");
};

// 粘贴
const handlePaste = () => {
  if (!copiedComponent.value) return;
  store.dispatch("componentsStore/pasteComponent");
};

// 上移
const handleMoveUp = () => {
  if (isLocked.value) return;
  const oldIndex = componentList.value.findIndex(
    (c) => c.fe_id === selectedId.value
  );
  if (oldIndex === 0) return;
  store.dispatch("componentsStore/moveComponent", {
    oldIndex: oldIndex,
    newIndex: oldIndex - 1,
  });
};

// 下移
const handleMoveDown = () => {
  if (isLocked.value) return;
  const oldIndex = componentList.value.findIndex(
    (c) => c.fe_id === selectedId.value
  );
  if (oldIndex === componentList.value.length - 1) return;
  store.dispatch("componentsStore/moveComponent", {
    oldIndex: oldIndex,
    newIndex: oldIndex + 1,
  });
};

// 撤销
const handleUndo = () => {
  if (!canUndo.value) return;
  store.dispatch("componentsStore/undo");
};

// 重做
const handleRedo = () => {
  if (!canRedo.value) return;
  store.dispatch("componentsStore/redo");
};

/*
  @description: 保存
*/

const { loading, run: save } = useRequest(
  async () => {
    const id = route.params.id;
    if (!id) return;
    await updateQuestionService(id, {
      ...pageInfo.value,
      componentList: componentList.value,
    });
  },
  {
    manual: true,
  },
  {
    onSuccess: () => {
      ElMessage.success("保存成功");
    },
    onError: () => {
      ElMessage.error("保存失败");
    },
  }
);

const handleSave = () => save();

const saveDebounce = useDebounceFn(() => {
  if (!loading.value) save();
}, 1000);

watch(
  [() => pageInfo.title, () => componentList.value],
  () => {
    saveDebounce();
  },
  {
    deep: true,
  }
);

/*
  @description: 快捷键
*/

onMounted(() => {
  window.addEventListener("keydown", onKeyDown, true);
  store.dispatch("componentsStore/initHistory");
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown, true);
});

const onKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (!loading.value) save();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    if (!canUndo.value) return;
    store.dispatch("componentsStore/undo");
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
    e.preventDefault();
    if (!canRedo.value) return;
    store.dispatch("componentsStore/redo");
  }
};

/*
  @description: 发布
*/

const { loading: publishLoading, run: publish } = useRequest(
  async () => {
    const id = route.params.id;
    if (!id) return;
    const res = await updateQuestionService(id, {
      ...pageInfo.value,
      componentList: componentList.value,
      isPublished: true,
    });

    if (res) {
      ElMessage.success("发布成功");
      router.push(`/question/stat/${id}`);
    } else {
      ElMessage.warning("发布状态更新失败");
    }
  },
  {
    manual: true,
  }
);

const handlePublish = () => publish();
</script>

<style scoped lang="scss">
@use "./EditHeader.module.scss" as *;
</style>
