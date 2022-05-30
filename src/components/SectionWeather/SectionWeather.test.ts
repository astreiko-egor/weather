import { mount, flushPromises, enableAutoUnmount } from '@vue/test-utils';
import axios from 'axios';

import { IDefaultItem, IGeoPosition } from '@/types';
import store from '@/store';
import SectionWeatherVue from './SectionWeather.vue';
import { jestMockImplementation } from '@/__moks__';

describe('SectionWeatherVue', () => {
  const geoPosition: IGeoPosition = {
    lat: 60.9025,
    lng: 32.2565,
  };
  const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: geoPosition.lat,
            longitude: geoPosition.lng,
          },
        })
      )
    ),
  };

  let wrapper: any;
  enableAutoUnmount(afterEach);

  let spyDispatch: jest.SpyInstance<Promise<any>> | null;
  beforeEach(async () => {
    (window as any).navigator.geolocation = mockGeolocation;
    spyDispatch = jest.spyOn(store, 'dispatch');
    axios.get = jest.fn().mockImplementation(jestMockImplementation);
    wrapper = mount(SectionWeatherVue, {
      global: {
        provide: {
          store,
          sessionStorage: window.sessionStorage,
        },
        mocks: {
          axios,
        },
      },
    });
    await flushPromises();
  });

  afterEach(() => {
    (window as any).sessionStorage.clear();
    spyDispatch = null;
    jest.clearAllMocks();
  });

  it('loadWeatherCurrentPositionItem "create"', () => {
    wrapper.vm.onGetLocation();
    expect(spyDispatch).toHaveBeenCalledWith(
      'weather/loadWeatherCurrentPositionItem',
      {
        geoPosition,
        type: 'create',
      }
    );
  });

  it('loadWeatherDefaultItem "create"', async () => {
    wrapper.vm.cityInput.value = 'Moscow';
    wrapper.vm.onAddCity();
    expect(spyDispatch).toHaveBeenCalledWith('weather/loadWeatherDefaultItem', {
      city: 'Moscow',
      type: 'create',
    });
    await flushPromises();
    const findMoscow = JSON.parse(
      window.sessionStorage.defaultItems as string
    ).find((item: { city: string }) => item.city === 'Moscow');
    expect(findMoscow).not.toBeUndefined();

    wrapper.vm.cityInput.value = 'M';
    wrapper.vm.onAddCity();
    await flushPromises();
    expect(wrapper.vm.cityInput.message).toBe('city not found');
  });

  it('onCheckValidateCityInput', async () => {
    wrapper.find('.section-weather__show-modal').trigger('click');
    await flushPromises();
    wrapper.find('.input .input__field').setValue(5555);
    expect(wrapper.vm.cityInput.message).toBe('The value is not alphabetical');
    expect(wrapper.vm.cityInput.status).toBe('error');

    wrapper.find('.input .input__field').setValue('Moscow');
    expect(wrapper.vm.cityInput.message).toBe('');
    expect(wrapper.vm.cityInput.status).toBe('');
  });

  it('onClearCity', () => {
    wrapper.vm.cityInput.value = 'test';
    wrapper.vm.cityInput.status = 'error';
    wrapper.vm.cityInput.message = 'test';
    wrapper.vm.onClearCity();
    expect(wrapper.vm.cityInput.value).toBe('');
    expect(wrapper.vm.cityInput.status).toBe('');
    expect(wrapper.vm.cityInput.message).toBe('');
  });

  it('onCloseModal', async () => {
    wrapper.find('.section-weather__show-modal').trigger('click');
    await flushPromises();
    expect(wrapper.vm.isShowModal).toBe(true);
    wrapper.vm.onCloseModal();
    expect(wrapper.vm.isShowModal).toBe(false);
  });

  it('onAddCity', async () => {
    wrapper.vm.cityInput.value = 'Vitebsk';
    wrapper.vm.onAddCity();
    await flushPromises();
    expect(wrapper.vm.cityInput.value).toBe('');

    await flushPromises();
    wrapper.vm.cityInput.value = 'Vitebsk';
    wrapper.vm.onAddCity();
    await flushPromises();
    expect(wrapper.vm.cityInput.message).toBe(
      'The city is already on the list'
    );
  });

  it('onSubmit', async () => {
    const spyOnAddCity = jest.fn();
    wrapper.vm.onAddCity = spyOnAddCity;
    wrapper.vm.isShowModal = true;
    wrapper.vm.cityInput.value = 'Homel';
    wrapper.vm.onSubmit();
    expect(wrapper.vm.isDisabledBtnAdd).toBe(false);
  });

  it('onReloadWeatherCurrentPosition', async () => {
    wrapper.vm.onReloadWeatherCurrentPosition();
    await flushPromises();
    expect(spyDispatch).toBeCalledWith(
      'weather/loadWeatherCurrentPositionItem',
      {
        geoPosition,
        type: 'update',
      }
    );
  });

  it('findCityDefaultItemById', async () => {
    expect(wrapper.vm.findCityDefaultItemById('123123213')).toBe(undefined);
  });

  it('onReloadWeatherDefaultItem', async () => {
    wrapper.vm.loadWeatherDefaultItem('London', 'create');
    await flushPromises();
    const id = store.state.weather?.defaultItems[0].data.id;
    const city = store.state.weather?.defaultItems[0].data.city;
    wrapper.vm.onReloadWeatherDefaultItem(id);
    expect(spyDispatch).toBeCalledWith('weather/loadWeatherDefaultItem', {
      city,
      type: 'update',
    });

    wrapper.vm.onReloadWeatherDefaultItem('74u124124u1249');
  });

  it('onRemoveWeatherDefaultItem', async () => {
    await wrapper.vm.loadWeatherDefaultItem('Brest', 'create');
    await flushPromises();
    const findBrest = store.state.weather?.defaultItems.find(
      (item: IDefaultItem) =>
        item.data.city.toLowerCase() === 'Brest'.toLowerCase()
    );
    const id = findBrest?.data.id;
    const city = findBrest?.data.city;

    wrapper.vm.onRemoveWeatherDefaultItem(id);
    expect(spyDispatch).toBeCalledWith('weather/removeDefaultItem', city);

    wrapper.vm.onRemoveWeatherDefaultItem('74u124124u1249');
  });

  it('loadWeatherCurrentPositionItemFromTheStorage', async () => {
    (window as any).sessionStorage.currentPositionItem = JSON.stringify({
      lat: geoPosition.lat,
      lng: geoPosition.lng,
      dateAdd: new Date(),
    });

    const wrapper = mount(SectionWeatherVue, {
      global: {
        provide: {
          store,
          sessionStorage: window.sessionStorage,
        },
        mocks: {
          axios,
        },
      },
    });

    await flushPromises();

    expect(spyDispatch).toHaveBeenCalledWith(
      'weather/loadWeatherCurrentPositionItemFromTheStorage'
    );

    wrapper.unmount();
  });

  it('loadWeatherDefaultItemsForTheStorage', async () => {
    (window as any).sessionStorage.defaultItems = JSON.stringify([
      {
        city: 'Dubai',
        dateAdd: new Date(),
      },
    ]);
    const wrapper = mount(SectionWeatherVue, {
      global: {
        provide: {
          store,
          sessionStorage: window.sessionStorage,
        },
        mocks: {
          axios,
        },
      },
    });

    await flushPromises();

    const findDubai = store.state.weather?.defaultItems.find(
      (item: IDefaultItem) =>
        item.data.city.toLowerCase() === 'Dubai'.toLowerCase()
    );

    expect(findDubai).not.toBeUndefined();
    wrapper.unmount();
  });
});
