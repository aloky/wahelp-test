<template>
  <div
    class="modal"
    @click="$emit('close')"
  >
    <div
      class="modal-content"
      @click.stop
    >
      <div class="modal-content--header">
        <div>{{ title }}</div>
        <button
          class="button"
          @click="$emit('close')"
        >
          ✖
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, defineEmits } from 'vue';

defineEmits(['close']);

defineProps({
  title: {
    type: String,
    default: null
  },
});

document.body.style.overflow = 'hidden';

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
.modal {
  z-index: 10000;
  position: fixed;
  background-color: #0000006b;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &-content {
    cursor: default;
    width: 400px;
    margin: 0 auto;
    padding: 32px;
    background-color: #fff;
    border-radius: 8px;

    &--header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 24px;
    }
  }
}
</style>