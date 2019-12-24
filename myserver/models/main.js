const mongoose = require('mongoose');//引入mongoose
mongoose.connect('mongodb://localhost:27017/info', {
    useNewUrlParser: true,
     useUnifiedTopology: true ,
});//连接数据库
mongoose.set('useCreateIndex', true)  
let db = mongoose.connection;
db.on("error", function (error) {
    console.log("错误：" + error);
});
 
db.on("open", function () {
    console.log("连接成功");
});
 
db.on('disconnected', function () {
    console.log('连接断开');
});
module.exports = mongoose;//抛出mongose对象