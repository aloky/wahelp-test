<template>
  <div class="user">
    <div class="user-card">
      <div class="user-card--name">
        {{ user.name }}
      </div>
      <div class="user-card--count">
        {{ posts.length }}
      </div>
    </div>
    <UserPosts
      v-model:posts="posts"
      :user-id="user.id"
    />
  </div>
</template>

<script setup>
import UserPosts from './UserPosts.vue';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const posts = ref([]);

onMounted(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${props.user.id}/posts`);
  posts.value = await response.json();
});
</script>


<style lang="scss" scoped>
.user {
  position: relative;
  &-card {
  border: 1px solid #ddd;
  padding: 8px;
  min-width: 200px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &--count {
    border: 1px solid #ddd;
    padding: 4px;
  }
}
}
</style>