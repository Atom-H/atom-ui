import {
    shallowMount
} from '@vue/test-utils'
import AButton from '@/packages/Button/Button.vue'

describe('Button.vue', () => {
    it('测试theme是否生效', () => {
        const wrapper = shallowMount(AButton, {
            propsData: {
                theme: 'info'
            }
        })
        expect(wrapper.classes()).toContain('atom-btn--info');
    });

    it('测试是否是<button>', () => {
        const wrapper = shallowMount(AButton)
        expect(wrapper.contains('button')).toBe(true);
    });




    //   it('matches snapshot', () => {
    //     const items = ['item 1', 'item 2']
    //     const wrapper = shallowMount(List, {
    //       propsData: { items }
    //     })
    //     expect(wrapper.html()).toMatchSnapshot()
    //   })
})