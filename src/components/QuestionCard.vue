<template>
  <div class="container" v-for="question in questionList" :key="question._id">
    <div class="title">
      <div class="left">
        <Link href="#">
          <Space>
            <StarOutlined v-if="question.isStar" style="color: red" />
            <Link>{{ question.title }}</Link>
          </Space>
        </Link>
      </div>
      <div class="right">
        <Space>
          <Text :type="question.isPublished ? 'success' : 'default'">
            {{ question.isPublished ? "已发布" : "未发布" }}
          </Text>
          <Text>答卷：{{ question.answerCount }}</Text>
          <Text>创建时间：{{ question.createdAt }}</Text>
        </Space>
      </div>
    </div>
    <Divider style="margin: 12px 0" />
    <div class="button-container">
      <div class="left">
        <Button
          type="text"
          :icon="h(EditOutlined)"
          @click="handleEdit(question._id)"
        >
          编辑问卷
        </Button>
        <Button
          type="text"
          :icon="h(BarChartOutlined)"
          @click="handleStat(question._id)"
        >
          问卷统计
        </Button>
      </div>
      <div class="right">
        <Button
          type="text"
          :icon="h(StarOutlined)"
          @click="handleStar(question._id)"
        >
          {{ question.isStar ? "取消标星" : "标星" }}
        </Button>
        <Button type="text" :icon="h(CopyOutlined)">复制</Button>
        <Button
          type="text"
          :icon="h(DeleteOutlined)"
          @click="handleMove(question._id)"
          >删除</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { Typography, Space, Button, Divider } from "ant-design-vue";
import {
  EditOutlined,
  BarChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { h } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { Text, Link } = Typography;
const store = useStore();

const props = defineProps({
  questionList: {
    type: Array,
    required: true,
  },
});

const handleStar = (id) => {
  store.commit("starQuestionList", id);
};

const handleMove = (id) => {
  store.commit("moveQuestion", [id]);
};

const handleEdit = (id) => {
  router.push(`/question/edit/${id}`);
};

const handleStat = (id) => {
  router.push(`/question/stat/${id}`);
};
</script>

<style lang="scss" scoped>
@use "./QuestionCard.module.scss" as *;
</style>
