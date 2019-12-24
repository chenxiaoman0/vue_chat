const mongoose = require('./main'); //引入main模块
const Schema = mongoose.Schema;

/**
 * User Schema
 */
//存储群信息
const  groupsRecordSchema= new Schema({
    //发送者sendId  房间id
    //发送时间 消息内容
    sendId: { type: String,default: ''},
    roomId:{type: String,default: ''},
    userName: {type: String,default: ''}, // 发送者用户名
    avatar:{type: String,default: ''}, // 发送者头像
    addTime: { type: Number, default: '' },//发送时间
    chatMes: { type: String, default: '' },//发送消息
    type: { type: Number, default: 0 }//发送类型 0是文字 1是图片
  })
// module.exports=mongoose.model('User', UserSchema);
var GroupsRecord = mongoose.model('GroupsRecord', groupsRecordSchema);

module.exports = GroupsRecord;