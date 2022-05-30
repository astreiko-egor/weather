import { mount, flushPromises } from '@vue/test-utils';
import AppInputVue from './AppInput.vue';

describe('AppInputVue', () => {
  it('Не отображается, если не передавать value', () => {
    const wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      template: '<app-input/>',
    });

    expect(wrapper.find('.input').exists()).toBe(false);
    wrapper.unmount();
  });

  it('Отображается, если указывать value', () => {
    const wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: '',
      }),
      template: '<app-input v-model:value="inputValue"/>',
    });
    expect(wrapper.find('.input').exists()).toBe(true);
    wrapper.unmount();
  });

  it('dynamicVisibleClassForPlaceholder', async () => {
    let wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: '',
      }),
      template: '<app-input v-model:value="inputValue"/>',
    });
    const input = wrapper.getComponent({ name: 'AppInput' });

    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe('');

    wrapper.vm.inputValue = 'text';
    await flushPromises();
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-hidden'
    );

    wrapper.vm.inputValue = '';
    await flushPromises();
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe('');

    wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: 'text',
      }),
      template: '<app-input v-model:value="inputValue"/>',
    });
    const input2 = wrapper.getComponent({ name: 'AppInput' });

    expect(input2.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-hidden'
    );

    wrapper.unmount();
  });

  it('computedStatusClass', () => {
    const wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: 'text',
        inputStatus: 'error',
      }),
      template: '<app-input v-model:value="inputValue" :status="inputStatus"/>',
    });
    const input = wrapper.getComponent({ name: 'AppInput' });

    expect(input.vm.computedStatusClass).toEqual({
      input: 'input--is-error',
      field: 'input__field-is-error',
      placeholder: 'input__placeholder--is-error',
      message: 'input__message--is-error',
    });

    wrapper.unmount();
  });

  it('computedFieldMarginBottom', async () => {
    const wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: 'text',
        inputMessage: '',
      }),
      template:
        '<app-input v-model:value="inputValue" :message="inputMessage"/>',
    });

    const input = wrapper.getComponent({ name: 'AppInput' });

    expect(input.vm.refMessage).toBeNull();
    expect(input.vm.computedFieldMarginBottom).toBeUndefined();

    wrapper.vm.inputMessage = 'message';
    await flushPromises();
    expect(input.vm.refMessage).not.toBeUndefined();

    wrapper.unmount();
  });

  it('computedVisibleClassForMessage', async () => {
    const wrapper = mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: 'text',
        inputMessage: '',
      }),
      template:
        '<app-input v-model:value="inputValue" :message="inputMessage"/>',
    });
    const input = wrapper.getComponent({ name: 'AppInput' });

    expect(input.vm.computedVisibleClassForMessage).toBe('');

    wrapper.vm.inputMessage = 'message';
    await flushPromises();
    expect(input.vm.computedVisibleClassForMessage).toBe(
      'input__message--is-visible'
    );

    wrapper.unmount();
  });

  const renderForEvents = () => {
    return mount({
      components: {
        'app-input': AppInputVue,
      },
      data: () => ({
        inputValue: 'text',
      }),
      template: '<app-input v-model:value="inputValue"/>',
    });
  };

  it('onFocus', async () => {
    const wrapper = renderForEvents();
    const input = wrapper.getComponent({ name: 'AppInput' });

    await input.find('.input__field').trigger('focus');
    await flushPromises();
    expect(input.vm.statusEvent).toBe('focus');
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-hidden'
    );

    wrapper.setData({ inputValue: ' ' });
    await flushPromises();
    await input.find('.input__field').trigger('focus');
    await flushPromises();
    expect(input.vm.statusEvent).toBe('focus');
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-opacity'
    );

    wrapper.unmount();
  });

  it('onInput', async () => {
    const wrapper = renderForEvents();
    const input = wrapper.getComponent({ name: 'AppInput' });
    const newValue = '5';

    input.find('.input__field').setValue(newValue);
    await flushPromises();
    expect(input.vm.statusEvent).toBe('input');
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-hidden'
    );
    expect(input.emitted()['update:value'][0]).toEqual([newValue]);

    input.find('.input__field').setValue('');
    await flushPromises();
    expect(input.vm.statusEvent).toBe('input');
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-opacity'
    );
    expect(input.emitted()['update:value'][1]).toEqual(['']);

    wrapper.unmount();
  });

  it('onBlur', async () => {
    const wrapper = renderForEvents();
    const input = wrapper.getComponent({ name: 'AppInput' });

    await input.find('.input__field').trigger('blur');
    await flushPromises();
    expect(input.vm.statusEvent).toBe('blur');
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe(
      'input__placeholder--is-hidden'
    );

    input.find('.input__field').setValue(' ');
    await flushPromises();
    await input.find('.input__field').trigger('blur');
    await flushPromises();
    expect(input.vm.statusEvent).toBe('blur');
    expect(input.vm.dynamicVisibleClassForPlaceholder).toBe('');

    wrapper.unmount();
  });
});
