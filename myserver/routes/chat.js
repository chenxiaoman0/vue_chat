var express = require('express');
var fs = require('fs');
var URL = require('url');
var path = require('path');
var multer  = require('multer')
// var upload = multer({ dest: './public/imgs' });
var router = express.Router();

//数据库
const Record = require('../models/record')
const Group = require('../models/group')
const GroupRecord = require('../models/grouprecords')
const mongoose = require('mongoose');
//上传图片中间件
// const fileUpload = require('express-fileupload');
// app.use(fileUpload());
//查找私聊聊天记录
router.get('/getRecord', function (req, res, next) {
  const pageSize = 10 //每页的数据量
  const {page,sendId,toId } = req.query
  console.log(page)
  Record.count({ // 获取数据条数
        $or: [
          {"sendId":req.query.sendId,"toId":req.query.toId},{"sendId":req.query.toId,"toId":req.query.sendId}
        ]
    }, (err, count) => { //查询出结果返回
      Record.find({
            $or: [
              {"sendId":req.query.sendId,"toId":req.query.toId},{"sendId":req.query.toId,"toId":req.query.sendId}
            ]
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({'_id': -1})
            .exec((err, doc) => {
              console.log(doc)
                try {
                    if (!err && doc) {
                        return res.json({code: 0, totalCount: count, msg: '列表获取成功', data: doc})
                    }
                    res.json({code: 1, msg: '后端出错'})
                } catch (e) {
                    res.json({code: 1, msg: '后端出错'})
                }
            })
    })
})

//查找群聊聊天记录
router.get('/getGroupRecord', function (req, res, next) {
  // GroupRecord.find({"roomId":req.query.roomId},function(err,data){
  //   res.send(data)
  // });
  
  const pageSize = 10 //每页的数据量
  const {page} = req.query
  GroupRecord.count({"roomId":req.query.roomId}, (err, count) => { //查询出结果返回
      GroupRecord.find({"roomId":req.query.roomId})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({'_id': -1})
            .exec((err, doc) => {
              console.log(doc)
                try {
                    if (!err && doc) {
                        return res.json({code: 0, totalCount: count, msg: '列表获取成功', data: doc})
                    }
                    res.json({code: 1, msg: '后端出错'})
                } catch (e) {
                    res.json({code: 1, msg: '后端出错'})
                }
            })
    })

})

//查找群聊记录列表
router.get('/getGroupList', function (req, res, next) {
  Group.find({"member.id":req.query.id},function(err,data){
    res.json(data)
  });
})


const storage = multer.diskStorage({
  // 用来配置文件上传的位置
  destination: (req, file, cb) => {
    // 调用 cb 即可实现上传位置的配置
    cb(null, './uploads');
  },
  // 用来配置上传文件的名称（包含后缀）
  filename: (req, file, cb) => {
    //filename 用于确定文件夹中的文件名的确定。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。
    // 获取文件的后缀
    let ext = path.extname(file.originalname);
    // 拼凑文件名
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
var imageLimit = {
    //限制文件大小10kb
    fileSize: 10*1000,
    //限制文件数量
    files: 5
}

//创建multer对象
var upload = multer({ 
  storage: storage,
  limits: imageLimit
 })
//上传图片
router.post('/uploadImg', upload.single('file'), function (req, res, next) {
  var file = req.file;
  if(res){
    res.json({success:true,imgsrc:'http://192.168.43.247:3000/'+file.filename});
  }
})


//头像接口(待修改)
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

  Record.update(wherestr, updatestr, function (err, data) {
    if (err) {
      res.json({ success: 'fasle'})
    } else {
      res.json({ success: 'true'})
    }
  });

})
console.log(__dirname)
module.exports = router;
