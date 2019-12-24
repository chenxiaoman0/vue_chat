import {request} from './request'

// //获取图片接口
// export function getAvatar() {
//   return request({
//     url: '/users/getImages'
//   })
// }
// //保存图片
// export function getHomeMultidata() {
//   return request({
//     url: '/home/multidata'
//   })
// }

export function getGoodsData(type,page) {
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}
