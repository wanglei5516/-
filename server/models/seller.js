const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shitang', {
	useNewUrlParser: true,       //这个即是报的警告
    useUnifiedTopology: true     //这个即是报的警告
})
const Schema = mongoose.Schema;
const sellerSchema = new Schema({
	id: String,
	name: String,
	phone: Number,
	location: String,
	state: Boolean,//true营业，false休息
	num: Number,//销量
	fee: Number,//配送费
	img: String,
	orderlist:[{
		id: Number,
		state: Number,//0已支付，1已接单，2已收到
		userid: String,
		sellerid: String,
		fee: Number,//配送费
		date: { type: Date,default: Date.now },
		useradd: {
			name: String,
			phone: Number,
			location: String
		},
		selleradd:{
			name: String,
			phone: Number,
			location: String
		},
		comment: String,
		dish:[{
			id: Number,
			name: String,
			classify: String,
			classify_id: Number,//新增，我去怎么少写了，出错就删掉
			price: {type: Number, default: 0},
			num: {type: Number, default: 0},
			img: String,
		}],
		price: {type: Number, default: 0}
	}],
	dish:[{
		id: Number,
		name: String,
		classify: String,
		classify_id: Number,
		price: {type: Number, default: 0},
		num: {type: Number, default: 0},
		img: String,
	}],
	classify:[{
		id: Number,
		name: String,
	}]

})
const Seller = mongoose.model('Seller',sellerSchema);
module.exports = Seller;