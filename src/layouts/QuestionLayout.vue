<template>
  <div>Question Layout</div>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
export default {};
</script>

<style scoped></style>
