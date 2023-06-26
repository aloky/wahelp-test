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
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const users = computed(() => store.state.users);

onMounted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const result = await response.json();
  store.commit('setUsers', result);
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
