import axios from 'axios'
import {sessionData} from '../utils'
import {Message} from 'element-ui'
import router from '../router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const httpServer = {}

httpServer.install = function (vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use((config) => {
    if (config.url !== 'login') {
      config.headers.Authorization = sessionData('get', 'token') || null
    }
    NProgress.start()
    return config
  })
  axios.interceptors.response.use((response) => {
    NProgress.done()
    if (response.status !== 200) {
      return {
        status: response.status,
        msg: '网络请求出错'
      }
    } else {
      const {data, meta} = response.data
      return new Promise((resolve, reject) => {
        if (meta.status === 200) {
          resolve(data)
        } else if (meta.status === 201) {
          resolve(data)
        } else if (meta.status === 401 || meta.status === 403) {
          Message.error('登录已过期请重新登录')
          sessionData('clean', 'token')
          router.replace({
            path: '/login'
          })
        } else {
          Message.error(`${meta.msg}`)
          reject(meta)
        }
      })
    }
  })
  vue.prototype.$http = axios
}

export default httpServer
