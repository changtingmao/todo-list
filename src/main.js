import Vue from 'vue'
import 'reset-css';

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// day.js
import dayjs from 'dayjs'
const dateFormatDash = (date, format = 'YYYY-MM-DD') => {
  return date ? dayjs(date).format(format) : ''
}
const timeParserPlugin = {
  install(Vue, options) {
    Vue.prototype.$dateFormatDash = dateFormatDash
  }
}
Vue.use(timeParserPlugin);

import App from './App.vue';

new Vue({
  el: '#app',
  render: h => h(App)
})
