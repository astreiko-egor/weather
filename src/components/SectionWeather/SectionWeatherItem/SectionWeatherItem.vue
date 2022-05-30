<template>
  <div v-if="isVisible" class="weather-item">
    <div class="weather-item__content">
      <span class="weather-item__city"> {{ city }} </span>

      <span class="weather-item__country"> {{ country }} </span>

      <div v-if="listInfoItems.length" class="weather-item__list-info">
        <div
          v-for="infoItem in listInfoItems"
          :key="infoItem.heading"
          class="weather-item__row"
        >
          <span v-if="infoItem.heading" class="weather-item__heading">
            {{ infoItem.heading }}
          </span>
          <span v-if="infoItem.value" class="weather-item__value">
            {{ infoItem.value }}
          </span>
        </div>
      </div>

      <span class="weather-item__date-add">
        {{ computedDateAdd }}
      </span>

      <div v-if="isRemove || isReload" class="weather-item__actions">
        <app-btn
          v-if="isRemove"
          class="btn--transparent-medium-purple weather-item__remove"
          text="remove"
          @click="onRemove(id)"
        />
        <app-btn
          v-if="isReload"
          class="btn--transparent-medium-purple weather-item__reload"
          text="reload"
          @click="onReload(id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  computed,
  onMounted,
  ref,
  onBeforeUnmount,
} from 'vue';
import { v4 } from 'uuid';
import moment from 'moment';

const AppBtn = defineAsyncComponent(
  () => import('@/components/AppBtn/AppBtn.vue')
);

const props = withDefaults(
  defineProps<{
    id: string;
    city: string;
    country: string;
    listInfoItems: {
      heading: string;
      value: string;
    }[];
    dateAdd: string | Date;
    isRemove: boolean;
    isReload: boolean;

    isAutoReload?: boolean;
    autoReloadTime?: number;
  }>(),
  {
    id: v4(),
    listInfoItems: () => [],
    isAutoReload: false,
    autoReloadTime: 60000,
  }
);

const emit = defineEmits<{
  (e: 'onAutoReload', id: string): void;
  (e: 'onRemove', id: string): void;
  (e: 'onReload', id: string): void;
}>();

const timer = ref();
onMounted(() => {
  if (props.isAutoReload) {
    timer.value = setInterval(() => {
      emit('onAutoReload', props.id);
    }, props.autoReloadTime);
  }
});

const isVisible = computed(
  () =>
    typeof props.city !== 'undefined' &&
    typeof props.country !== 'undefined' &&
    typeof props.listInfoItems.length !== 'undefined' &&
    typeof props.dateAdd !== 'undefined' &&
    (props.isRemove || props.isReload)
);

const momentDateAdd = moment(props.dateAdd);
const momentCurrentDate = moment(new Date());

const computedDateAdd = computed(() =>
  moment.duration(momentDateAdd.diff(momentCurrentDate)).humanize(true)
);

const onRemove = (id: string) => {
  emit('onRemove', id);
};

const onReload = (id: string) => {
  clearInterval(timer.value);
  emit('onReload', id);
};

onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
.weather-item {
  &__content {
    background-color: $white;
    box-shadow: 0px 2px 10px rgba($cod-gray2, 0.25);
    border-radius: 6px;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  &__city,
  &__country,
  &__row {
    color: $text-primary;
  }

  &__city {
    font-weight: 700;
    font-size: 32px;
    line-height: 38px;
    margin-bottom: 15px;
  }

  &__country,
  &__row {
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
  }

  &__country {
    margin-bottom: 40px;
  }

  &__list-info {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid $silver;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__date-add {
    align-self: flex-end;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: $silver-chalice;
    margin-bottom: 32px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__reload {
    margin-left: auto;
  }

  @media (max-width: 575px) {
    &__city {
      font-size: 25px;
      line-height: 31px;
    }

    &__country,
    &__info {
      font-size: 14px;
      line-height: 20px;
    }

    &__info {
      padding-bottom: 8px;
    }

    &__date {
      font-size: 15px;
    }
  }
}
</style>
