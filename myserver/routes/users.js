var express = require('express');
var router = express.Router();
const User = require('../models/userinfo')
const mongoose = require('mongoose');

//加密
// var bcrypt=require('bcrypt');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post('/login', function (req, res, next) {
  // console.log(req)
  //查找
  User.findOne({ // 先在数据库里面找到对应的数据
    phone: req.body.phone
  }).then(isUser => {
    if (isUser === null) {
      res.json({ success: 'fasle', msg: '您输入的用户名有误' })
    }
    const isPass = require("bcryptjs").compareSync(req.body.password, isUser.password)
    if (!isPass) { // 如果匹配失败的话
      res.json({ success: 'fasle', msg: '您输入的密码不正确' })
    }
    const data = {
      username: isUser.username,
      avatar: isUser.avatar,
      id: isUser._id,
      unReadMessage: isUser.unreadMessage
    }
    res.json({ success: 'true', msg: data })
  })
})
//注册
router.post('/register', function (req, res, next) {
  User.create({
    phone: req.body.phone,
    username: req.body.username,
    password: req.body.password
  }, function (error, user) {
    if (error) {
      res.json({ success: 'false', msg: '该用户已被注册' })
    } else {
      const data = {
        username: user.username,
        avatar: user.avatar,
        id: user._id,
        unReadMessage: user.unreadMessage
      }
      res.json({ success: 'true', msg:data })
    }
  })

})
//获取头像资源
router.get('/getImages', function (req, res, next) {
  // res.end(__dirname)
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      src: 'http://192.168.43.247:3000/images/avatar/' + i + '.jpg'
    })
  }
  res.json(data);
})

//更新头像
router.post('/setAvatar', function (req, res, next) {
  var wherestr = { _id: req.body.id };
  // 执行更新数据
  var updatestr = { avatar: req.body.avatar }
  User.update(wherestr, updatestr, function (err, data) {
    if (err) {
      res.json({ success: 'fasle' })
    } else {
      res.json({ success: 'true' })
    }
  });

})
module.exports = router;
