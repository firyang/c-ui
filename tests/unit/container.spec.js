import { shallowMount, mount } from '@vue/test-utils'
import { expect } from 'chai'

import Container from '@/packages/container/container'
import Header from '@/packages/container/header'
import Main from '@/packages/container/main'
import Aside from '@/packages/container/aside'
import Footer from '@/packages/container/footer'

describe('container.vue', () => {
    it('1. 测试 direction 属性', async () => {
        let wapper = shallowMount(Container, {
            attachToDocument: true,
            stubs: {
                'v-header': Header,
                'v-main': Main,
                'v-aside': Aside,
                'v-footer': Footer,
            },
            slots: {
                default: '<v-header></v-header><v-aside></v-aside><v-main></v-main><v-footer></v-footer>'
            }
        })
        expect(wapper.vm.$el.className).include('is-vertical')
        wapper.setProps({ direction: 'horizontal' })
        await wapper.vm.$nextTick()
        expect(wapper.vm.$el.className).not.include('is-vertical') // 未通过，渲染有问题
    })
})