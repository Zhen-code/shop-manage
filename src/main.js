// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import httpServer from '@/plugins/http'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.filter('formatTime', function (e) {
  if (!e) {
    return ''
  }
  let date = new Date(e)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = ('0' + m).substr(-2)
  let d = date.getDate()
  return y + '-' + m + '-' + d
})
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(httpServer)
Vue.use(VueQuillEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
