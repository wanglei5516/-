const express= require('express')
const Seller = require('./models/seller');
const User = require('./models/user');

const router = express.Router();

let orderId = 0; //自增

router.get('/users',(req,res)=>{
	//改逻辑，只要扫码，就是用户，保存到数据库
	const query = req.query;
	
	const id = query.id;
	User.findOne({
		id: id
	},(err,user)=>{
		if(err){
			return console.error(err);
		}
		if(!user){
			//新建user
			var newuser = new User({
				id: id,
				addresslist: [],
				orderlist: [],
			})
			newuser.save((err,data)=>{
				if(err){
					console.error(err);
				}
				// console.log(data);
				res.json(data);
			});
		}else{
			res.json(user)
		}
	})
	
})

router.post('/users',(req,res)=>{
	const body = req.body;
	console.log('post请求/users:',body);
	const id = body.id;
	let obj = body.item;
	User.findOneAndUpdate({
		id: id
	},{$set: {addresslist: item}},{new:true},(err,user)=>{
		if(err){
			return console.error(err);
		}
		console.log("新addresslist",user);
		res.json(user);
	})
})

router.post('/users/address',(req,res)=>{
	const body = req.body;
	console.log('post请求/users/address:',body);
	const id = body.id;
	const item = body.item;
	User.findOneAndUpdate({
		id: id
	},{$set: {addresslist: item}},{new:true},(err,user)=>{
		if(err){
			return console.error(err);
		}
		console.log("新addresslist",user);
		res.json(user);
	})
})

router.post('/users/orderlist',(req,res)=>{
	const body = req.body;
	console.log('post请求/users/orderlist:',body);
	const id = body.id;
	const item = body.item;
	User.findOneAndUpdate({
		id: id
	},{$set: {orderlist: item}},{new:true},(err,user)=>{
		if(err){
			return console.error(err);
		}
		console.log("新orderlist",user);
		res.json(user);
	})
})









router.get('/sellers',(req,res)=>{
	const query = req.query;
	//没传参数
	if(!query.id){
		Seller.find((err,data)=>{
			if(err){
				return console.error(err);
			}
			// console.log(data);
			res.json(data);
		})
	}else{
		const id = query.id;
		Seller.findOne({
			id: id
		},(err,seller)=>{
			if(err){
				return console.error(err);
			}
			if(!seller){
				//seller 不存在，没找到 err_code:0
				return res.json({
					err_code: 0,
					message: 'seller不存在，没找到！'
				})
			}else{
				res.json(seller)
			}
		})
	}
})
router.post('/sellers',(req,res)=>{
	const body = req.body;
	console.log('post:',body)
	Seller.findOne({
		id: body.id
	},(err,data)=>{
		if(!data){
			var seller = new Seller({
				id: body.id,
				name: body.name,
				phone: body.phone,
				location: body.location,
				state: true,//true营业，false休息
				num: 500,//销量
				fee: 1,//配送费
				img: body.img,
				orderlist:[],
				dish:[//初始化菜单，自己加了几个菜品
				{
					id:0,
					classify:'盖浇饭',
					classify_id:0,
					name:'茄子盖浇饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:1,
					classify:'盖浇饭',
					classify_id:0,
					name:'肉末盖浇饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:2,
					classify:'盖浇饭',
					classify_id:0,
					name:'豆角盖浇饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:3,
					classify:'盖浇饭',
					classify_id:0,
					name:'番茄土豆盖浇饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:4,
					classify:'盖浇饭',
					classify_id:0,
					name:'鸡蛋炒饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:5,
					classify:'盖浇饭',
					classify_id:0,
					name:'火腿炒饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:6,
					classify:'盖浇饭',
					classify_id:0,
					name:'辣椒炒饭',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				},{
					id:7,
					classify:'盖浇饭',
					classify_id:0,
					name:'鱼香肉丝炒面',
					price:12,
					num:0,
					img:'../../images/hunan.jpeg'
				}],
				classify:[{id:0,name:'盖浇饭'},{id:1,name:'炒饭'},{id:2,name:'炒面'},{id:3,name:'汤饭'},{id:4,name:'米粉'},
				]
            })
            seller.save((err,data)=>{
				if(err){
					console.error(err);
				}
				// console.log(data);
				res.json(data);
			});
		}else{
			res.json({
				err_code: 1,
				message: 'seller已存在，重复注册！'
			});
		}
	})
})

router.post('/sellers/classify',(req,res)=>{
	const body = req.body;
	console.log('post请求/sellers/classify:',body);
	const id = body.id;
	const item = body.item;
	Seller.findOneAndUpdate({
		id: id
	},{$set: {classify: item}},{new:true},(err,seller)=>{
		if(err){
			return console.error(err);
		}
		console.log("新classify",seller.classify);
		res.json(seller);
	})
})

router.post('/sellers/name',(req,res)=>{
	const body = req.body;
	console.log('post请求/sellers/name:',body);
	const id = body.id;
	const item = body.item;
	Seller.findOneAndUpdate({
		id: id
	},{$set: {name: item}},{new:true},(err,seller)=>{
		if(err){
			return console.error(err);
		}
		// console.log("新classify",seller.classify);
		res.json(seller);
	})
})

router.post('/sellers/phone',(req,res)=>{
	const body = req.body;
	console.log('post请求/sellers/phone:',body);
	const id = body.id;
	const item = body.item;
	Seller.findOneAndUpdate({
		id: id
	},{$set: {phone: item}},{new:true},(err,seller)=>{
		if(err){
			return console.error(err);
		}
		// console.log("新classify",seller.classify);
		res.json(seller);
	})
})

router.post('/sellers/location',(req,res)=>{
	const body = req.body;
	console.log('post请求/sellers/location:',body);
	const id = body.id;
	const item = body.item;
	Seller.findOneAndUpdate({
		id: id
	},{$set: {location: item}},{new:true},(err,seller)=>{
		if(err){
			return console.error(err);
		}
		// console.log("新classify",seller.classify);
		res.json(seller);
	})
})

router.post('/sellers/dish',(req,res)=>{
	const body = req.body;
	console.log('post请求/sellers/dish:',body);
	const id = body.id;
	const item = body.item;
	Seller.findOneAndUpdate({
		id: id
	},{$set: {dish: item}},{new:true},(err,seller)=>{
		if(err){
			return console.error(err);
		}
		console.log("新dish",seller.dish);
		res.json(seller);
	})
})

router.post('/sellers/orderlist',(req,res)=>{
	const body = req.body;
	console.log('post请求/sellers/orderlist:',body);
	const id = body.id;
	const item = body.item;
	Seller.findOneAndUpdate({
		id: id
	},{$set: {orderlist: item}},{new:true},(err,seller)=>{
		if(err){
			return console.error(err);
		}
		console.log("新orderlist",seller);
		res.json(seller);
	})
})
module.exports = router;