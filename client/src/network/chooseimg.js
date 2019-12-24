import {request} from './request'
const qs = require('qs');
//获取图片接口
export function getAvatar() {
  return request({
    url: '/users/getImages'
  })
}

//保存图片信息
export function setAvatar(user) {
  console.log(user)
  const data={
    id:user.id,
    avatar:user.avatar
}
    return request({
      url: '/users/setAvatar',
      method:'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data:qs.stringify(data),
    })
  }