<template>
  <section class="section-weather">
    <the-container>
      <div class="section-weather__content">
        <h1 class="section-weather__title">World Weather</h1>
        <div
          v-if="isVisibleCurrentPosition"
          class="section-weather__current-position-box"
        >
          <span class="section-weather__subtitle">
            Watch weather in your current location
          </span>
          <section-weather-item
            class="section-weather__item section-weather__item--big"
            :id="currentPositionItem.weather.data.id"
            :city="currentPositionItem.weather.data.city"
            :country="currentPositionItem.weather.data.country"
            :list-info-items="currentPositionItem.weather.data.listInfoItems"
            :date-add="currentPositionItem.weather.data.dateAdd"
            :is-remove="currentPositionItem.weather.actions.isRemove"
            :is-reload="currentPositionItem.weather.actions.isReload"
            :is-auto-reload="true"
            @onAutoReload="onReloadWeatherCurrentPosition"
            @onReload="onReloadWeatherCurrentPosition"
          />
        </div>
        <div v-else class="section-weather__current-position-box">
          <app-btn
            class="btn--transparent-medium-purple section-weather__get-location"
            text="Get location"
            @click="onGetLocation"
          />
        </div>
        <!-- /.section-weather__current-position-box -->

        <div v-if="isVisibleGridDefaultItems" class="section-weather__grid">
          <section-weather-item
            v-for="item in defaultItems"
            :key="item.data.id"
            class="weather__item"
            :id="item.data.id"
            :city="item.data.city"
            :country="item.data.country"
            :list-info-items="item.data.listInfoItems"
            :date-add="item.data.dateAdd"
            :is-remove="item.actions.isRemove"
            :is-reload="item.actions.isReload"
            :is-auto-reload="true"
            @onAutoReload="onReloadWeatherDefaultItem"
            @onReload="onReloadWeatherDefaultItem"
            @onRemove="onRemoveWeatherDefaultItem"
          />
        </div>
        <div v-else class="section-weather__grid">
          <span class="section-weather__list-empty">The list is empty</span>
        </div>
        <!-- /.section-weather__grid -->

        <app-btn
          class="btn--circle-medium-purple section-weather__show-modal"
          icon-name="plus"
          @click="onShowModal"
        />
        <app-modal
          class="section-weather__modal"
          v-if="isShowModal"
          @onClose="onCloseModal"
        >
          <span class="modal__title">Choose a city</span>
          <span class="modal__subtitle">
            To find city start typing and pick one from the suggestions
          </span>
          <form class="modal__form" @submit.prevent="onSubmit">
            <app-input
              class="modal__input"
              v-model:value="cityInput.value"
              :placeholder="cityInput.placeholder"
              :status="cityInput.status"
              :message="cityInput.message"
              @input="onCheckValidateCityInput"
              @blur="onCheckValidateCityInput"
            />
          </form>
          <div class="modal__bottom-actions">
            <app-btn
              class="btn--transparent-medium-purple modal__clear"
              text="clear"
              :is-disabled="!cityInput.value"
              @click="onClearCity"
            />
            <app-btn
              class="btn--transparent-medium-purple modal__cancel"
              text="cancel"
              @click="onCloseModal"
            />
            <app-btn
              class="btn--transparent-medium-purple modal__add"
              text="add"
              :is-disabled="isDisabledBtnAdd"
              @click="onAddCity"
            />
          </div>
        </app-modal>
      </div>
    </the-container>
  </section>
</template>

<script setup lang="ts">
import { IDefaultItem, IGeoPosition } from '@/types';
import { defineAsyncComponent, onMounted, computed, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { alpha, required } from '@vuelidate/validators';

const TheContainer = defineAsyncComponent(
  () => import('@/components/TheContainer/TheContainer.vue')
);

const SectionWeatherItem = defineAsyncComponent(
  () =>
    import(
      '@/components/SectionWeather/SectionWeatherItem/SectionWeatherItem.vue'
    )
);
const AppBtn = defineAsyncComponent(
  () => import('@/components/AppBtn/AppBtn.vue')
);
const AppModal = defineAsyncComponent(
  () => import('@/components/AppModal/AppModal.vue')
);
const AppInput = defineAsyncComponent(
  () => import('@/components/AppInput/AppInput.vue')
);

const store = useStore();

const loadWeatherCurrentPositionItemFromTheStorage = async () => {
  await store.dispatch('weather/loadWeatherCurrentPositionItemFromTheStorage');
};
const loadWeatherCurrentPositionItem = async (
  geoPosition: IGeoPosition,
  type: string
) => {
  await store.dispatch('weather/loadWeatherCurrentPositionItem', {
    geoPosition,
    type,
  });
};

const loadWeatherDefaultItemsForTheStorage = async () => {
  await store.dispatch('weather/loadWeatherDefaultItemsForTheStorage');
};
const loadWeatherDefaultItem = async (city: string, type: string) => {
  return await store.dispatch('weather/loadWeatherDefaultItem', { city, type });
};
const removeDefaultItem = async (city: string) => {
  await store.dispatch('weather/removeDefaultItem', city);
};

const currentPositionItem = computed(
  (): {
    geo: IGeoPosition;
    weather: IDefaultItem;
  } => {
    return {
      geo: store.state.weather.currentPositionItem.geoPosition,
      weather: store.state.weather.currentPositionItem.weather,
    };
  }
);

const defaultItems = computed((): IDefaultItem[] => {
  return store.getters['weather/sortDefaultItemsByDateAdd'];
});

const isVisibleCurrentPosition = computed(() =>
  Boolean(currentPositionItem.value.weather.data.id)
);

const isVisibleGridDefaultItems = computed(() => defaultItems.value.length);

const onGetLocation = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    loadWeatherCurrentPositionItem(
      {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      },
      'create'
    );
  });
};

const isShowModal = ref(false);

const onShowModal = () => {
  isShowModal.value = true;
};

const cityInput = ref({
  value: '',
  placeholder: 'Search city',
  status: '',
  message: '',
});
const validateState = reactive({ city: cityInput.value.value });
const validateRules = { city: { alpha, required } };
const v$ = useVuelidate(validateRules, validateState);

const onCheckValidateCityInput = () => {
  validateState.city = cityInput.value.value;
  cityInput.value.message = v$.value.city.$invalid
    ? (v$.value.city.$silentErrors[0].$message as string)
    : '';
  cityInput.value.status = v$.value.city.$invalid ? 'error' : '';
};

const onClearCity = () => {
  cityInput.value.value = '';
  cityInput.value.status = '';
  cityInput.value.message = '';
};

const onCloseModal = () => {
  isShowModal.value = false;
  onClearCity();
};

const onAddCity = async () => {
  await loadWeatherDefaultItem(cityInput.value.value, 'create')
    .then(() => {
      onClearCity();
    })
    .catch(({ message }) => {
      cityInput.value.status = 'error';
      cityInput.value.message = message;
    });
};

const isDisabledBtnAdd = computed(
  () => cityInput.value.status === 'error' || !cityInput.value.value
);

const onSubmit = () => {
  if (!isDisabledBtnAdd.value) {
    onAddCity();
  }
};

const onReloadWeatherCurrentPosition = () => {
  loadWeatherCurrentPositionItem(currentPositionItem.value.geo, 'update');
};

const findCityDefaultItemById = (id: string) => {
  return defaultItems.value.find((item: IDefaultItem) => item.data.id === id)
    ?.data.city;
};

const onReloadWeatherDefaultItem = (id: string) => {
  const city: string = findCityDefaultItemById(id) || '';
  if (city) {
    loadWeatherDefaultItem(city, 'update');
  }
};

const onRemoveWeatherDefaultItem = (id: string) => {
  const city: string = findCityDefaultItemById(id) || '';
  if (city) {
    removeDefaultItem(city);
  }
};

onMounted(async () => {
  await loadWeatherCurrentPositionItemFromTheStorage();
  await loadWeatherDefaultItemsForTheStorage();
});
</script>

<style lang="scss" scoped>
.section-weather {
  &__content {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: 25px;
    padding-bottom: 35px;
  }

  &__title {
    font-weight: 300;
    font-size: 70px;
    line-height: 80px;
    color: $text-primary;
    margin-bottom: 32px;
    text-align: center;
  }

  &__current-position-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 80px;
  }

  &__subtitle {
    font-size: 24px;
    line-height: 24px;
    margin-bottom: 20px;
    color: $boulder;
  }

  &__item {
    &--big {
      width: 100%;
      max-width: 825px;
    }
  }

  &__show-modal {
    position: fixed;
    right: 45px;
    bottom: 35px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 350px));
    grid-gap: 40px;
    justify-content: center;
    margin-top: auto;
  }

  &__list-empty {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $red;
  }

  @media (max-width: 575px) {
    &__title {
      font-size: 40px;
      line-height: 50px;
      margin-bottom: 15px;
    }

    &__heading {
      font-size: 20px;
      line-height: 20px;
      text-align: center;
    }

    &__current-location {
      margin-bottom: 60px;
    }

    &__grid {
      grid-template-columns: repeat(auto-fit, minmax(290px, 350px));
      grid-gap: 20px;
    }

    :deep(.section-weather__show-modal) {
      right: 10px;
      bottom: 10px;
      padding: 15px;
    }
  }
}
</style>
