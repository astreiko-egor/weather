<template>
  <div ref="refModal" class="modal" tabindex="-1" @keydown.esc="onClose">
    <div
      v-if="isVisibleContent"
      key="overlay"
      class="modal__overlay"
      @click="onClose"
    />
    <div v-if="isVisibleContent" key="inner-box" class="modal__inner-box">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const emit = defineEmits<{
  (e: 'onClose'): void;
}>();

const onClose = () => {
  isVisibleContent.value = false;
  emit('onClose');
};

const refModal = ref<HTMLDivElement | null>(null);

const isVisibleContent = ref(true);

onMounted(() => {
  if (refModal.value) {
    refModal.value.focus();
  }
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  display: flex;

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba($cod-gray, 0.5);
  }

  &__inner-box {
    background-color: $white;
    box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.14),
      0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    z-index: 1;
    margin: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  :slotted(.modal__title) {
    font-weight: 700;
    font-size: 32px;
    line-height: 38px;
    color: $text-primary;
    margin-bottom: 16px;
  }

  :slotted(.modal__subtitle) {
    font-size: 24px;
    line-height: 24px;
    color: $boulder;
    margin-bottom: 67px;
  }

  :slotted(.modal__form) {
    display: flex;
    flex-direction: column;
    margin-bottom: 140px;
  }

  :slotted(.modal__bottom-actions) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :slotted(.modal__clear) {
    margin-right: auto;
  }

  :slotted(.modal__cancel) {
    margin-right: 30px;
  }

  @media (max-width: 575px) {
    padding: 15px;

    :slotted(.modal__title) {
      font-size: 25px;
      line-height: 31px;
    }

    :slotted(.modal__subtitle) {
      font-size: 18px;
      line-height: 20px;
      margin-bottom: 40px;
    }

    :slotted(.modal__form) {
      margin-bottom: 60px;
    }
  }
}
</style>
