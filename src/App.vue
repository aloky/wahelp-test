<template>
  <div class="row">
    <UserCard
      v-for="user in users"
      :key="user.id"
      :user="user"
    />
  </div>
</template>

<script setup>
import UserCard from './components/UserCard.vue';
import { onMounted, ref } from 'vue';

const users = ref([]);

onMounted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');

  users.value = await response.json(); 
});
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  gap: 16px;
  overflow: scroll;
  padding: 16px;
}
</style>
