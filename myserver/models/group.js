

const mongoose = require('./main'); //引入main模块
const crypto = require('crypto');

const Schema = mongoose.Schema;

/**
 * User Schema
 */
//存储群聊天信息
const groupSchema = new Schema({
	masterId: String,
	masterName: String,
	roomId: String,
	chatGroupName: String,
	member: [{
		id: String,
		userName: String,
		avatar: String
	}]
})
// module.exports=mongoose.model('User', UserSchema);
var Group = mongoose.model('Group', groupSchema);

module.exports = Group;

