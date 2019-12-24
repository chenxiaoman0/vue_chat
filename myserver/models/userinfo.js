const mongoose = require('./main'); //引入main模块

const Schema = mongoose.Schema;

/**
 * User Schema
 */
//require("bcrypt").hashSync(val,10) // 第一个参数是 要散列的值 第二个参数散列的强度
//require("bcrypt").compareSync(原密码,数据库里面已经加密的) // 就是做散列的比较
const UserSchema = new Schema({
    //手机号 用户名 密码 头像
    phone: { type: Number,unique:true},
    username: { type: String, default: '' },
    password: { 
        type: String,
         default: '',
         set(val){
            return require('bcryptjs').hashSync(val,10)
        }
         },
    avatar: { type: String, default: '' },
    unreadMessage: [{
		id: String, default: '',
        count:Number, default: ''
	}]
    // 记录未读信息
});
// module.exports=mongoose.model('User', UserSchema);
var User = mongoose.model('User', UserSchema);

module.exports = User;
