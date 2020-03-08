// mongdb需要用mongoose链接操作
const mongoose=require('mongoose');
const honstname='0.0.0.0';
const port=27017;
const dbName="wh1910";
const username="?";
const password="?";
const CONN_DB_STR=`mongodb://${honstname}:${port}/${dbName}`;
mongoose.connect(CONN_DB_STR,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
},errror=>{
    if(errror) console.log('数据库连接失败')
    else{
        console.log('数据库连接成功')
    }

})

const connection=mongoose.connection;
// 监听各种连接状态

// 连接成功
connection.on("connected",()=>{
    console.log('Mongoose connection open to ' + CONN_DB_STR);  
})

// 数据库开启
connection.on("open",()=>{
    console.log('mongoose open')
});

// 链接异常
connection.on('error',err=>{
    console.log('Mongoose connection error: ' + err);  
    // res.json()
})

// 断开链接
connection.on('disconnected',()=>{
    console.log('Mongoose connection fail 链接失败')
})
module.exports=connection