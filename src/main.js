import Vue from 'vue'
import App from './App.vue'
import Cui from './packages'

Vue.use(Cui)

new Vue({
    render: h => h(App),
}).$mount('#app')
