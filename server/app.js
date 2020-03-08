const express=require('express');
const app=express();
// 服务的主机名，端口，
const honstname='0.0.0.0';
const port=1910;
const http=require('http');
const server=http.createServer(app);
const connection=require('./utils/connect');
const session=require('express-session');
const path=require('path')

// 解决跨域问题
var cors=require('cors');
app.use(cors())
app.get('/index',(req,res)=>{
    res.send('这是一个前后端分离的服务器')
})



app.use(express.json()); // 获取 POST 请求的 FormData  $.POST 
app.use(express.urlencoded({ extended: false }));  // 表单 Form  action  name   req.body 
app.use(express.static(path.join(__dirname, 'public')));
// 注意位置  设置session  session 中间件 req.session 
app.use(session({
    name:"AppText",
    cookie:{maxAge:1000*60*60},  // 时长 60min 
    secret:"test",
    resave:false,
    saveUninitialized:true
}))


var {checkToken} =require("./utils");
app.use(checkToken);  // 配置校验 token 的中间件 

// 路由别名
var vueRouter=require('./vue');
app.use('/vue',vueRouter)

app.get('/demo/:uid',(req,res)=>{
    res.json({
        msg:"demp ---demo---demo--",
        headers:req.headers,
        url:req.url,
        path:req.path,
        body:req.body,//post请求传过来的参数
        params:req.params,//:后的参数
        query:req.query
    })
})

server.listen(port,honstname,()=>{
    console.log(`my server is running at http://${honstname}:${port}`)
})