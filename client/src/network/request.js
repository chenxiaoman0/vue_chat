import axios from 'axios'

export function request(config) {
    const instance = axios.create({
      baseURL:'http://192.168.43.247:3000/',
      timeout:5000,
      //示跨域请求时是否需要使用凭证. 默认为false
      // withCredentials: true
    })
    //请求拦截
    instance.interceptors.request.use(config => {
      return config;
    },err => {
      console.log(err)
    })
    //响应拦截
    instance.interceptors.response.use(res => {
      return res.data
    },error => {
      console.log(error)
    })
    return instance(config)
  }