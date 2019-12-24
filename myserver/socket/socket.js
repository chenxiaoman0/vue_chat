const Record = require('../models/record')//私人记录
const GroupRecord = require('../models/grouprecords')//群聊记录
const Group = require('../models/group')//群聊
const User = require('../models/userinfo')//群聊
var socket_io = require('socket.io');
var socketio = {};
let userList = [];
let chatGroupList = {};
//未读消息的记录
let unReadmsg={};
socketio.getSocketio = function (server) { // http(s) server
	var io = socket_io.listen(server);
	io.sockets.on('connection', function (socket) {
		//前端socket.emit('login')发送消息，后端socket.on('login')接收
		socket.on('login', (userInfo) => {
			console.log(userInfo)
			let exitUser = userList.filter(item => item.id == userInfo.id)
			//判断用户是否在线
			if(exitUser.length<=0){
				userList.push(userInfo);
				io.emit('userList', userList);
			}
		})
		socket.on('getUserList', (userInfo) => {
			socket.emit('userList', userList);
			/*  io.emit(给所有客户端广播消息) =
				socket.emit(给该socket的客户端发送消息) + socket.broadcast.emit(发给所以客户端，不包括自己)
			*/
		})
		//私聊 发送给特定的接收者
		socket.on('sendMsg', (data) => {
			// let socketId = userList[to] // 查找接收方的socketID
			let toUser= userList.filter(item => item.id == data.toId)[0]
			// let meSocketId = userList[from] // 查找发送方的socketID
			let sendUser = userList.filter(item => item.id == data.sendId)[0]
			// // 判断接收方是否在线
			console.log(userList)
			// console.log(toUser)
			if (toUser.socketId) {
			  // 在线就直接发送
			  let receiveMsgdata={
				sendId: data.sendId, userName: data.userName, chatMes: data.chatMes, avatar: data.avatar,type:data.type||0
			  }
			  socket.to(toUser.socketId).emit('receiveMsg', receiveMsgdata)
			  addRecord(data)
			}else{
			// // 将消息存储到数据库
				addRecord(data)
			}
		})
		//创建群聊
		socket.on('createChatGroup', data => {
			socket.join(data.roomId);
			chatGroupList[data.member.roomId] = data;  // 群聊列表数据
			// 群聊的每一个成员发送chatGroupList(当前群聊数据)、createChatGroup(创建群聊)消息
			data.member.forEach(item => {
				// io.to(item.socketId).emit('chatGroupList', data)
				io.to(item.socketId).emit('createChatGroup', data)
			});
			let arr=data.member.filter((value,index)=>{
				return value.socketId!=socket.id
			})
			arr.forEach(item => {
				io.to(item.socketId).emit('chatGroupList', data)
				// io.to(item.socketId).emit('createChatGroup', data)
			});
			addGroup(data)
		})

		//用户加入群聊
		socket.on('joinChatGroup', data => {
			socket.join(data.roomId);
			//为房间中的所有的socket发送消息, 包括自己
			socket.broadcast.to(data.roomId).emit("chatGrSystemNotice", {
					roomId: data.roomId,
					msg: data.userName+'加入了群聊!',
				});
		})
		//群聊发送消息
		socket.on('sendMsgGroup', (data) => {
			// socket.to(data.roomId).emit('receiveMsgGroup', data);
			socket.broadcast.to(data.roomId).emit("receiveMsgGroup",data);
			addGroupRecord(data)
			// let exitUser = userList.filter(item => item.id == userInfo.id)
			// let exitUser=userList.find((value,index)=>{
			// 	return data
			// })
		})
		//存储未读消息
		socket.on('setUnReadmsg', (data) => {
			console.log(data)
			// userInfo.unreadMessage=data
			unReadmsg[data.id]=data.unreadMessage
			console.log(unReadmsg)
			// addUnReadMessage(data)
		})
		// 退出（内置事件）
		socket.on('disconnect', () => {
			let user=userList.find((item,idnex)=>{
				return item.socketId== socket.id
			})
			if(user){
				let userId=user.id
				let data={
					id:userId,
					unreadMessage:unReadmsg[userId]
				}
				//将未读消息存储到数据库
				addUnReadMessage(data)
			}
			userList = userList.filter(item => item.socketId != socket.id)
			io.emit('quit', userList)
		})

	})

};

//添加私聊数据
function addRecord(data){
	Record.create({
		...data,addTime:+new Date(),
	  })
}
//创建群
function addGroup(data){
	// console.log(data)
	data.member.forEach((item)=>{
		delete item.socketId
	})
	Group.create({...data,addTime:+new Date()})
}
//创建群记录
function addGroupRecord(data){
	GroupRecord.create({...data,addTime:+new Date()},(err,data)=>{
		if(err){
			// console.log(err)
		}else{
			// console.log(data)
		}
	})
}

//记录未读消息
function addUnReadMessage(data){
	var wherestr = { _id: data.id }
  // 执行更新数据
  var updatestr = { unreadMessage:data.unreadMessage }
  User.update(wherestr, updatestr, function (err, data) {
    if (err) {
		// console.log(err)
    //   res.json({ success: 'fasle'})
    } else {
		// console.log(data)
    //   res.json({ success: data})
    }
  });
}

module.exports = socketio;