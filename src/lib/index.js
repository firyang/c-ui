import firRadio from './radios/Radio'

const components = {
  install(Vue){
    Vue.component('firRadio', firRadio)
  }
}

if(typeof window !== 'undefined' && window.Vue) {
  window.Vue(components)
}

export default components