<template>
  <div v-if="isVisible" class="input" :class="[computedStatusClass.input]">
    <input
      type="text"
      :value="value"
      class="input__field"
      :class="[computedStatusClass.field]"
      :style="[
        `margin-bottom: ${
          computedFieldMarginBottom ? computedFieldMarginBottom : 0
        }px`,
      ]"
      @focus="onFocus"
      @input="onInput(($event.target as HTMLInputElement).value)"
      @blur="onBlur"
    />
    <span
      v-if="placeholder"
      class="input__placeholder"
      :class="[dynamicVisibleClassForPlaceholder, computedStatusClass.field]"
    >
      {{ placeholder }}
    </span>
    <span
      v-if="message"
      ref="refMessage"
      class="input__message"
      :class="[computedVisibleClassForMessage, computedStatusClass.message]"
    >
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUpdated } from 'vue';
const props = withDefaults(
  defineProps<{
    value: string;
    placeholder?: string | null;
    status?: string;
    message?: string | null;
  }>(),
  {
    status: '',
  }
);

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'focus'): void;
  (e: 'input'): void;
  (e: 'blur'): void;
}>();

const statusEvent = ref('blur');
const dynamicVisibleClassForPlaceholder = ref(
  props.value ? 'input__placeholder--is-hidden' : ''
);

const computedStatusClass = computed(() => {
  if (props.status === 'error') {
    return {
      input: 'input--is-error',
      field: 'input__field-is-error',
      placeholder: 'input__placeholder--is-error',
      message: 'input__message--is-error',
    };
  }

  return {
    input: '',
    field: '',
    placeholder: '',
    message: '',
  };
});

const isVisible = computed(() => typeof props.value !== 'undefined');

const refMessage = ref<HTMLSpanElement | null>(null);

const computedFieldMarginBottom = computed(() => {
  return refMessage.value?.clientHeight;
});

const computedVisibleClassForMessage = computed(() =>
  props.message ? 'input__message--is-visible' : ''
);

const onFocus = () => {
  statusEvent.value = 'focus';
  dynamicVisibleClassForPlaceholder.value = !props.value.trim()
    ? 'input__placeholder--is-opacity'
    : 'input__placeholder--is-hidden';
  emit('focus');
};

const onInput = (value: string) => {
  statusEvent.value = 'input';
  dynamicVisibleClassForPlaceholder.value = value
    ? 'input__placeholder--is-hidden'
    : 'input__placeholder--is-opacity';
  emit('update:value', value);
  emit('input');
};

const onBlur = () => {
  statusEvent.value = 'blur';
  dynamicVisibleClassForPlaceholder.value = props.value.trim()
    ? 'input__placeholder--is-hidden'
    : '';
  emit('update:value', props.value.trim());
  emit('blur');
};

onUpdated(() => {
  if (!props.value && statusEvent.value === 'blur') {
    dynamicVisibleClassForPlaceholder.value = '';
  } else if (Boolean(props.value) && statusEvent.value === 'blur') {
    dynamicVisibleClassForPlaceholder.value = 'input__placeholder--is-hidden';
  }
});
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  overflow: hidden;
  $input: &;

  &__field,
  &__placeholder {
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
  }

  &__field {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    padding-bottom: 16px;
    border-bottom: 1px solid $text-primary;
    transition: all 0.3s ease;
  }

  &__placeholder {
    position: absolute;
    top: 3px;
    left: 0;
    width: 100%;
    pointer-events: none;
    display: flex;
    align-items: center;
    color: $silver2;
    transition: all 0.3s ease;

    &--is-opacity {
      opacity: 0.4;
    }

    &--is-hidden {
      opacity: 0;
    }
  }

  &__message {
    position: absolute;
    bottom: 0;
    left: -100%;
    opacity: 1;
    padding-top: 12px;
    font-size: 16px;
    line-height: 24px;
    color: $text-primary;
    transition-delay: 5s;
    transition: all 0.5s ease;

    &--is-visible {
      left: 0;
      opacity: 1;
    }
  }

  &--is-error {
    #{$input}__field {
      color: $red;
      border-bottom-color: $red;
    }

    #{$input}__message {
      color: $red;
    }
  }

  @media (max-width: 575px) {
    &__field,
    &__placeholder {
      font-size: 18px;
      line-height: 20px;
    }
  }
}
</style>
