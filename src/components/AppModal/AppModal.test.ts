import { mount, flushPromises } from '@vue/test-utils';
import AppModalVue from './AppModal.vue';

describe('AppModalVue', () => {
  const render = () => {
    const wrapper = mount(
      {
        components: {
          'app-modal': AppModalVue,
        },
        data: () => ({
          isShowModal: false,
        }),
        methods: {
          onShow: () => {
            wrapper.vm.isShowModal = true;
          },
        },
        template: `<span class="btn" @click="onShow" />
                  <app-modal v-if="isShowModal" @onClose="isShowModal = false"><div class="modal__title">Test slot title</div></app-modal>`,
      },
      {
        attachTo: document.body,
      }
    );

    return wrapper;
  };

  it('Отрисовка модального окна', async () => {
    const wrapper = render();

    expect(wrapper.find('modal').exists()).toBe(false);
    await wrapper.find('.btn').trigger('click');
    await flushPromises();
    expect(wrapper.find('.modal').exists()).toBe(true);

    wrapper.unmount();
  });

  it('onClose', async () => {
    const wrapper = render();

    await wrapper.find('.btn').trigger('click');
    await flushPromises();
    await wrapper.find('.modal').trigger('keydown', { key: 'escape' });
    await flushPromises();
    expect(wrapper.find('.modal').exists()).toBe(false);

    await wrapper.find('.btn').trigger('click');
    await flushPromises();
    await wrapper.find('.modal__overlay').trigger('click');
    await flushPromises();
    expect(wrapper.find('.modal').exists()).toBe(false);

    wrapper.unmount();
  });

  it('Отображение содержимого slot', async () => {
    const wrapper = render();

    await wrapper.find('.btn').trigger('click');
    await flushPromises();
    expect(wrapper.find('.modal__inner-box > .modal__title').text()).toBe(
      'Test slot title'
    );

    wrapper.unmount();
  });
});
