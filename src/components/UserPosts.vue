<template>
  <draggable 
    :model-value="posts"
    group="posts"
    item-key="id"
    class="posts"
    @change="onChange"
  >
    <template #item="{ element }">
      <div class="posts-item">
        <div class="posts-item--title">
          {{ element.title }}
        </div>
        <div
          class="posts-item--body"
          v-html="element.body"
        />
        <div class="posts-item--action">
          <button
            class="button"
            @click="changePost(element)"
          >
            Изменить
          </button>
          <button
            class="button"
            @click="removePost(element.id)"
          >
            Удалить
          </button>
        </div>
      </div>
    </template>
  </draggable>
  <div class="posts--action">
    <button
      class="button"
      @click="dialog = true"
    >
      Создать пост
    </button>
  </div>
  <TheModal
    v-if="dialog"
    :title="dialogTitle"
    @close="dialog = false"
  >
    <form
      class="form"
      @submit.prevent="submit"
    >
      <select
        v-if="post.id"
        v-model="post.userId"
        class="input"
      >
        <option
          v-for="user in users"
          :key="user.id"
          :value="user.id"
        >
          {{ user.id }}
        </option>
      </select>
      <input
        v-model="post.title"
        placeholder="Title"
        type="text"
        class="input"
        required
      >
      <textarea
        v-model="post.body"
        placeholder="Body"
        type="text"
        class="input"
        rows="4"
        required
      />
      <button
        class="button"
        type="submit"
      >
        {{ post.id ? 'Сохранить' : 'Добавить' }}
      </button>
    </form>
  </TheModal>
</template>

<script setup>
import draggable from 'vuedraggable';
import { defineProps, watch, defineEmits, ref, computed } from 'vue';
import { useStore } from 'vuex';
import TheModal from './TheModal.vue';

const store = useStore();
const emit = defineEmits(['update:posts']);

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
});

const users = computed(() => store.state.users);

const post = ref({
  title: '',
  body: '',
  userId: props.userId,
});

const dialog = ref(false);
const dialogTitle = computed(() => post.value.id ? 'Редактирование поста' : 'Добавление поста');

watch(dialog, (value) => {
  if (!value) {
    post.value = {
      title: '',
      body: '',
      userId: props.userId,
    };
  }
});

const changePost = (value) => {
  post.value = { ...value };
  dialog.value = true;
};

const removePost = (id) => {
  store.commit('removePost', { userId: props.userId, postId: id });
};

const onChange = ({ added, removed, moved }) => {
  if (added) {
    added.element.userId = props.userId;
    store.commit('movePost', { userId: props.userId, post: added });
  }

  if (moved) {
    store.commit('movePost', { userId: props.userId, post: moved });
  }

  if (removed) {
    removePost(removed.element.id);
  }
};

const submit = () => {
  if (post.value.id) {
    if (post.value.userId === props.userId) {
      const index = store.state.posts[props.userId].findIndex((el) => el.id === post.value.id);
      const arrayCopy = [...props.posts];
      arrayCopy.splice(index, 1, post.value);
      store.commit('setPosts', { userId: props.userId, posts: arrayCopy });
    } else {
      store.commit('addPost', { userId: post.value.userId, post: post.value });
      removePost(post.value.id);
    }
  } else {
    store.commit('addPost', { userId: props.userId, post: {
      ...post.value,
      id: Date.now(),
    }});
  }
  dialog.value = false;
};
</script>

<style lang="scss" scoped>
.posts {
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  &-item {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    padding: 8px;
    border: 1px solid #ddd;
    width: 200px;

    &--title {
      font-size: 18px;
      font-weight: bold;
      text-transform: capitalize;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &--body {
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &--action {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      gap: 8px
    }
  }

  &--action {
    margin-top: 8px;
    text-align: center;
  }
}
.form {
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  textarea {
    resize: vertical;
  }
}
</style>