<template>
  <button
    v-if="isVisible"
    class="btn"
    :class="[{ 'btn--is-disabled': isDisabled }]"
    :disabled="isDisabled"
  >
    <span v-if="text" class="btn__text"> {{ text }} </span>
    <app-svg-sprite v-if="iconName" class="btn__icon" :icon-name="iconName" />
  </button>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
const props = withDefaults(
  defineProps<{
    text?: string;
    iconName?: string;
    isDisabled?: boolean;
  }>(),
  {
    isDisabled: false,
  }
);

const AppSvgSprite = defineAsyncComponent(
  () => import('@/components/AppSvgSprite/AppSvgSprite.vue')
);

const isVisible = computed(() => Boolean(props.text || props.iconName));
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  $btn: &;

  &__icon,
  &__text {
    pointer-events: none;
  }

  &--circle-medium-purple {
    border-radius: 100%;
    padding: 21px;
    background-color: $medium-purple;
    color: $white;
    border: none;
    box-shadow: 0px 4px 5px rgba($black, 0.14), 0px 1px 10px rgba($black, 0.12),
      0px 2px 4px rgba($black, 0.2);

    #{$btn}__icon {
      width: 14px;
      height: 14px;
    }
  }

  &--transparent-medium-purple {
    background-color: transparent;
    text-transform: uppercase;
    font-size: 16px;
    line-height: 24px;
    color: $medium-purple;

    &#{$btn}--is-disabled {
      color: $silver2;
    }
  }

  &--is-disabled {
    pointer-events: none;
  }
}
</style>
