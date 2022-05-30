import { mount, flushPromises } from '@vue/test-utils';
import AppSvgSpriteVue from './AppSvgSprite.vue';

describe('AppSvgSpriteVue', () => {
  const render = () => {
    return mount({
      data: () => ({
        iconName: '',
      }),
      template: '<app-svg-sprite :icon-name="iconName" />',
      components: {
        'app-svg-sprite': AppSvgSpriteVue,
      },
    });
  };
  it('Не отрисовывается без iconName', () => {
    const wrapper = render();

    expect(wrapper.find('.icon').exists()).toBe(false);
    wrapper.unmount();
  });

  it('Не отрисовывается c iconName не существующей иконки', async () => {
    const wrapper = render();
    const icon = 'minus';
    wrapper.setData({
      iconName: icon,
    });
    await flushPromises();
    expect(wrapper.find('.icon').exists()).toBe(false);
    wrapper.unmount();
  });

  it('Отрисовывается с iconName существующей иконки', async () => {
    const wrapper = render();
    const icon = 'plus';
    wrapper.setData({
      iconName: icon,
    });
    await flushPromises();
    expect(wrapper.find('.icon').exists()).toBe(true);
    expect(wrapper.find('.icon').classes('icon--' + icon)).toBe(true);
    wrapper.unmount();
  });
});
