import { shallowMount } from '@vue/test-utils'
import { expect } from 'chai'

import Container from '@/packages/container/container'
import Header from '@/packages/container/header'
import Main from '@/packages/container/main'
import Aside from '@/packages/container/aside'
import Footer from '@/packages/container/footer'

describe('container.vue', () => {
    it('1. 测试默认排列方式', async () => {
        let wapper = shallowMount(Container, {
            attachToDocument: true,
            stubs: {
                'c-header': Header,
                'c-main': Main,
                'c-aside': Aside,
                'c-footer': Footer,
            },
            slots: {
                default: '<c-header></c-header><c-aside></c-aside><c-main></c-main><c-footer></c-footer>'
            }
        })
        await wapper.vm.$nextTick()
        expect(wapper.vm.$el.className).include('is-vertical')
    })
    it('2. 测试 direction 属性', async () => {
        let wapper = shallowMount(Container, {
            attachToDocument: true,
            stubs: {
                'c-header': Header,
                'c-main': Main,
                'c-aside': Aside,
                'c-footer': Footer
            },
            slots: {
                default: '<c-header></c-header><c-aside></c-aside><c-main></c-main><c-footer></c-footer>'
            },
            propsData: {
                direction: 'horizontal'
            }
        })
        await wapper.vm.$nextTick()
        expect(wapper.vm.$el.className).not.include('is-vertical')
    })
})