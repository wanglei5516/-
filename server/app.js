const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const router = require('./router')
// const session = require('express-session')
var bodyParser = require('body-parser')
// var router = require('./router')

const app = express()


// const sellers = require('./routes/api/sellers');

app.use('/public',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
mongoose.set('useFindAndModify', false)
// app.engine('html',require('express-art-template'))
//app.set('views', render函数的默认路径)
// app.set('views',path.join(__dirname,'./views/'))

// 配置解析表单 POST 请求体插件（注意：中间件相当于函数，有顺序，一定要在具体业务 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 在 Express 这个框架中，默认不支持 Session 和 Cookie
// 但是我们可以使用第三方中间件：express-session 来解决
// 1. npm install express-session
// 2. 配置 (一定要在 app.use(router) 之前)
// 3. 使用
//    当把这个插件配置好之后，我们就可以通过 req.session 来发访问和设置 Session 成员了
//    添加 Session 数据：req.session.foo = 'bar'
//    访问 Session 数据：req.session.foo

// app.use(session({
//   // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
//   // 目的是为了增加安全性，防止客户端恶意伪造
//   secret: 'itcast',
//   resave: false,
//   saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
// }))

// 把路由挂载到 app 中
app.use(router)
// 使用routes
// 
// app.use('/api/users', users);
// app.use('/api/sellers', sellers);

// app.use((req,res)=>{
// 	res.render('404.html')
// })

// app.use((err,req,res,next)=>{
// 	res.status(500).json({
// 		err_code: 500,
// 		message: err.message
// 	})
// })

app.listen(5000,()=>{
	console.log('server running 5000')
})