import {request} from './request'
const qs = require('qs');
export function checkUser(user){
    const data={
        phone:user.phone,
        password:user.password,
    }
    return request({
        method:'POST',
        url:'users/login',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data:qs.stringify(data),
    })
}
export function register(user){
    const data={
        phone : user.phone,
        username:user.username,
        password:user.password,
    }
    return request({
        method:'POST',
        url:'users/register',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data:qs.stringify(data),
    })
}