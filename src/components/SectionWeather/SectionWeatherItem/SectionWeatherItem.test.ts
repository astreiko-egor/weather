import { mount, flushPromises } from '@vue/test-utils';
import { v4 } from 'uuid';
import SectionWeatherItemVue from './SectionWeatherItem.vue';

describe('SectionWeatherItemVue', () => {
  it('Не отображается без city, country, listInfoItems, dateAdd, (isRemove или isReload)', () => {
    const wrapper = mount({
      components: {
        'section-weather-item': SectionWeatherItemVue,
      },
      template: '<section-weather-item />',
    });
    expect(wrapper.find('.weather-item').exists()).toBe(false);

    wrapper.unmount();
  });

  it('isVisible', () => {
    const wrapper = mount({
      components: {
        'section-weather-item': SectionWeatherItemVue,
      },
      data: () => ({
        id: v4(),
        city: 'London',
        country: 'Great Britain',
        listInfoItems: [
          {
            heading: 'Weather',
            value: 'Clouds',
          },
        ],
        dateAdd: new Date(),
        isRemove: false,
        isReload: true,
      }),
      template: `<section-weather-item 
                  :id="id" 
                  :city="city" 
                  :country="country" 
                  :list-info-items="listInfoItems" 
                  :date-add="dateAdd" 
                  :is-remove="isRemove" 
                  :is-reload="isReload" />`,
    });
    const sectionWeatherItem = wrapper.getComponent({
      name: 'SectionWeatherItem',
    });

    expect(sectionWeatherItem.vm.isVisible).toBe(true);

    wrapper.unmount();
  });

  const renderForEvents = () => {
    return mount({
      components: {
        'section-weather-item': SectionWeatherItemVue,
      },
      data: () => ({
        id: v4(),
        city: 'London',
        country: 'Great Britain',
        listInfoItems: [
          {
            heading: 'Weather',
            value: 'Clouds',
          },
        ],
        dateAdd: new Date(),
        isRemove: true,
        isReload: true,
      }),
      template: `<section-weather-item 
                  :id="id" 
                  :city="city" 
                  :country="country" 
                  :list-info-items="listInfoItems" 
                  :date-add="dateAdd" 
                  :is-remove="isRemove" 
                  :is-reload="isReload" />`,
    });
  };
  it('onRemove', async () => {
    const wrapper = renderForEvents();
    const id = wrapper.vm.id;

    await flushPromises();
    const sectionWeatherItem = wrapper.getComponent({
      name: 'SectionWeatherItem',
    });
    await sectionWeatherItem.find('.weather-item__remove').trigger('click');
    await flushPromises();
    expect(sectionWeatherItem.emitted().onRemove[0]).toEqual([id]);

    wrapper.unmount();
  });

  it('onReload', async () => {
    const wrapper = renderForEvents();
    const id = wrapper.vm.id;

    await flushPromises();
    const sectionWeatherItem = wrapper.getComponent({
      name: 'SectionWeatherItem',
    });
    await sectionWeatherItem.find('.weather-item__reload').trigger('click');
    await flushPromises();
    expect(sectionWeatherItem.emitted().onReload[0]).toEqual([id]);

    wrapper.unmount();
  });

  it('onAutoReload', () => {
    jest.useFakeTimers();
    const id = v4();
    const timeOut = 600;
    const wrapper = mount({
      components: {
        'section-weather-item': SectionWeatherItemVue,
      },
      template: `<section-weather-item id="${id}" :is-auto-reload="true" :autoReloadTime="${timeOut}" />`,
    });

    const vueSectionWeatherItem = wrapper.getComponent({
      name: 'SectionWeatherItem',
    });

    expect(vueSectionWeatherItem.emitted().onAutoReload).toBeUndefined();
    jest.advanceTimersByTime(timeOut);
    expect(vueSectionWeatherItem.emitted().onAutoReload[0]).toStrictEqual([id]);
    wrapper.unmount();
  });
});
