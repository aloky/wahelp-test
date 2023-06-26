<template>
  <draggable 
    :model-value="posts"
    group="posts"
    item-key="id"
    class="posts"
    @change="onChange"
  >
    <template #item="{element}">
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
        {{ isEditablePostId ? 'Сохранить' : 'Добавить' }}
      </button>
    </form>
  </TheModal>
</template>

<script setup>
import draggable from 'vuedraggable';
import { defineProps, watch, defineEmits, ref, computed } from 'vue';
import TheModal from './TheModal.vue';

const emit = defineEmits(['update:posts']);

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

const post = ref({
  title: '',
  body: ''
});
const isEditablePostId = ref(null);
const dialog = ref(false);
const dialogTitle = computed(() => isEditablePostId.value ? 'Редактирование поста' : 'Добавление поста');

watch(dialog, (value) => {
  if (!value) {
    isEditablePostId.value = null;
    post.value.title = '';
    post.value.body = '';
  }
});

const changePost = ({ title, body, id }) => {
  isEditablePostId.value = id;
  post.value.title = title;
  post.value.body = body;
  dialog.value = true;
};

const removePost = (id) => {
  emit('update:posts', props.posts.filter((el) => el.id !== id));
};

const moveElement = (array, { element, newIndex, oldIndex }) => {
  let arrayCopy = [...array];

  if (oldIndex !== undefined) {
    arrayCopy.splice(oldIndex, 1);
  }

  arrayCopy.splice(newIndex, 0, element);
  return arrayCopy;
};

const onChange = ({ added, removed, moved }) => {
  if (added) {
    added.element.userId = props.userId;
    emit('update:posts', moveElement(props.posts, added));
  }

  if (moved) {
    emit('update:posts', moveElement(props.posts, moved));
  }

  if (removed) {
    removePost(removed.element.id);
  }
};

const submit = () => {
  const { title, body } = post.value;
  if (isEditablePostId.value) {
    const index = props.posts.findIndex((el) => el.id === isEditablePostId.value);
    const arrayCopy = [...props.posts];
    arrayCopy.splice(index, 1, {
      title,
      body,
      id: isEditablePostId.value,
      userId: props.userId
    });
    emit('update:posts', arrayCopy);
  } else {
    emit('update:posts', props.posts.concat({ title,
      body,
      id: Date.now(),
      userId: props.userId
    }));
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