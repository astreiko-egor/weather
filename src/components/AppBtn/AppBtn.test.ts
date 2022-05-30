import { mount, flushPromises } from '@vue/test-utils';
import AppBtnVue from './AppBtn.vue';

describe('AppBtnVue', () => {
  const render = () => {
    return mount({
      data: () => ({
        text: '',
        iconName: '',
      }),
      template: '<app-btn :icon-name="iconName" :text="text" />',
      components: {
        'app-btn': AppBtnVue,
      },
    });
  };
  it('Не отрисовывается без text и iconName', async () => {
    const wrapper = render();
    expect(wrapper.find('.btn').exists()).toBe(false);
    wrapper.unmount();
  });

  it('Отрисовывается только с текстом, если указать только text', async () => {
    const wrapper = render();
    const btnText = 'Button text';
    wrapper.setData({ text: btnText });
    await flushPromises();
    expect(wrapper.find('.btn__text').exists()).toBe(true);
    expect(wrapper.find('.btn__text').text()).toBe(btnText);
    expect(wrapper.find('.btn__icon').exists()).toBe(false);
    expect(wrapper.find('.btn').attributes().disabled).toBeUndefined();
    wrapper.unmount();
  });

  it('Отрисовывается только с иконкой, если указать только iconName', async () => {
    const wrapper = render();
    const btnIcon = 'plus';
    wrapper.setData({ iconName: btnIcon });
    await flushPromises();
    expect(wrapper.find('.btn__icon').exists()).toBe(true);
    expect(wrapper.find('.btn__icon').classes('icon--' + btnIcon)).toBe(true);
    expect(wrapper.find('.btn__text').exists()).toBe(false);
    expect(wrapper.find('.btn').attributes().disabled).toBeUndefined();
    wrapper.unmount();
  });

  it('Имеет класс btn--is-disabled и атрибут disabled, если передать isDisabled', async () => {
    const wrapper = mount({
      template: '<app-btn text="Button text" :is-disabled="true" />',
      components: {
        'app-btn': AppBtnVue,
      },
    });
    await flushPromises();
    expect(wrapper.find('.btn').classes('btn--is-disabled')).toBe(true);
    expect(wrapper.find('.btn').attributes().disabled).not.toBeUndefined();
    wrapper.unmount();
  });
});
