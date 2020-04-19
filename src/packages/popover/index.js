import Popover from './src/main'
import Vue from 'vue'


Popover.install = function (vue) {
    Vue.component(Popover.name, Popover)
}

export default Popover;