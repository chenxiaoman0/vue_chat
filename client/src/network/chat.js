import { request, imgrequest } from './request'
const qs = require('qs');
//添加私聊记录
// export function addRecord(data){
//     // const data={
//     //     phone:user.phone,
//     //     password:user.password,
//     // }
//     return request({
//         method:'POST',
//         url:'chat/addRecord',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         data:qs.stringify(data),
//     })
// }
//获得私聊记录
export function getRecord(toId, sendId, page = 1) {
    return request({
        url: 'chat/getRecord',
        params: {
            sendId: sendId,
            toId: toId,
            page: page
        }
    })
}
//获得群记录
export function getGroupList(id) {
    return request({
        url: 'chat/getGroupList',
        params: {
            id: id,
        }
    })
}
//添加群记录
//获取群记录
export function getGroupRecord(roomId, sendId, page=1) {
    return request({
        url: 'chat/getGroupRecord',
        params: {
            // sendId: sendId,
            roomId: roomId,
            page: page
        }
    })
}
//添加图片
export function uploadImg(data) {
    return request({
        url: '/chat/uploadImg',
        method: 'post',
        headers: { "content-type": "multipart/form-data" },
        data: data
    })
}
//存储未读消息

// export function addUnReadmsg(data) {
//     return request({
//         method: 'POST',
//         url: 'chat/addRecord',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         data: qs.stringify(data),
//     })
// }