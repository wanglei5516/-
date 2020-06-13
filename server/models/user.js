const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shitang', {
	useNewUrlParser: true,       //这个即是报的警告
    useUnifiedTopology: true     //这个即是报的警告
})
const Schema = mongoose.Schema;

const userSchema = Schema({
	id: String,
	addresslist:[{
		name: String,
		phone: Number,
		location: String,
		state: Boolean
	}],
	orderlist:[{
		id: Number,
		state: Number,//0已支付，1已接单，2已收到,3取消
		userid: String,
		sellerid: String,
		fee: Number,//配送费
		date: { type: Date, default: Date.now },
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
			classify_id: Number,
			price: {type: Number, default: 0},
			num: {type: Number, default: 0},
			img: String,
		}],
		price: {type: Number, default: 0}
	}]
})
const User = mongoose.model('User',userSchema);
module.exports = User;