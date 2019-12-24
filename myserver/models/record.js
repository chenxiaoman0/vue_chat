const mongoose = require('./main'); //引入main模块

const Schema = mongoose.Schema;

/**
 * User Schema
 */

const RecordSchema = new Schema({
    //发送者sendId  接收者toId
    //发送时间 消息内容
    sendId: { type: String,default: ''},
    toId:{type: String,default: ''},
    userName: {type: String,default: ''}, // 发送者用户名
    avatar:{type: String,default: ''}, // 发送者头像
    addTime: { type: Number, default: '' },//发送时间
    chatMes: { type: String, default: '' },//发送消息
    type: { type: Number, default: 0 }//发送类型 0是文字 1是图片
});
var Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
