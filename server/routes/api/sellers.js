// const express = require('express');
const router = express.Router();
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
const Seller = require('../../models/seller');
router.get('/',(req,res)=>{
	res.json({ msg: 'seller works'});
})

module.exports = router;