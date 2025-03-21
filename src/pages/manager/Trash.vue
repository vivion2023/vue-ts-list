<template>
  <div>
    <div class="header">
      <div class="left">
        <Title :level="2" style="margin-top: 0">回收站</Title>
      </div>
      <div class="right">
        <ListSearch />
      </div>
    </div>
    <div class="content">
      <div>
        <Space style="margin-bottom: 16px">
          <Button
            type="primary"
            :disabled="!selectedRowKeys.length"
            @click="handleRestore"
          >
            恢复
          </Button>
          <Button
            danger
            :disabled="!selectedRowKeys.length"
            @click="handleDelete"
          >
            彻底删除
          </Button>
        </Space>
      </div>
      <div>
        <Table
          :dataSource="questionList"
          :columns="columns"
          :pagination="{
            pageSize: 5, // 每页显示数量
            total: questionList.length, // 总数据量
            showTotal: (total) => `共 ${total} 条`, // 显示总数据量
            showSizeChanger: true, // 显示可以改变 pageSize 的选择器
            showQuickJumper: true, // 显示可以快速跳转的输入框
            pageSizeOptions: ['5', '10', '20', '50'], // 指定每页可以显示多少条
          }"
          :row-selection="rowSelection"
          rowKey="id"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import ListSearch from "@/components/ListSearch.vue";
import { Typography, Button, Space, Table, Tag } from "ant-design-vue";
import { computed, ref, h } from "vue";
import QuestionCard from "@/components/QuestionCard.vue";

const Title = Typography.Title;
const store = useStore();

const questionList = computed(() =>
  store.state.questionList.filter((question) => question.isDeleted)
);

// 表格列
const columns = ref([
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "是否发布",
    dataIndex: "isPublished",
    key: "isPublished",
    customRender: ({ text }) => {
      return h(
        Tag,
        {
          color: text ? "success" : "default",
        },
        () => (text ? "已发布" : "未发布")
      );
    },
  },
  {
    title: "答卷",
    dataIndex: "answerCount",
    key: "answerCount",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
  },
]);

// 存储选中的行
const selectedRowKeys = ref([]);

// 勾选框选中逻辑
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys;
  },
}));

// 恢复操作
const handleRestore = () => {
  store.commit("moveQuestion", selectedRowKeys.value);
};

// 彻底删除操作
const handleDelete = () => {
  store.commit("deleteQuestion", selectedRowKeys.value);
};
</script>

<style lang="scss" scoped>
@use "./common.module.scss" as *;
</style>
