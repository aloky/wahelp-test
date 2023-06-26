<template>
  <div class="user">
    <div class="user-card">
      <div class="user-card--name">
        {{ user.name }}
      </div>
      <div class="user-card--count">
        {{ posts?.length }}
      </div>
    </div>
    <UserPosts
      v-if="posts"
      :posts="posts"
      :user-id="user.id"
    />
  </div>
</template>

<script setup>
import UserPosts from './UserPosts.vue';
import { computed, defineProps, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
});

const posts = computed(() => store.state.posts[props.user.id]);

onMounted(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${props.user.id}/posts`);
  const result = await response.json();
  store.commit('setPosts', { userId: props.user.id, posts: result });
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