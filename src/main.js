import Vue from 'vue'
import App from './App.vue'
import Vui from './packages'

Vue.use(Vui)

new Vue({
    render: h => h(App),
}).$mount('#app')
