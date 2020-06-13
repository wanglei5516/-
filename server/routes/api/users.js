const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const gravatar = require('gravatar');
const keys = require('../../config/keys');
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
const User = require('../../models/user');

router.get('/',(req,res)=>{
	res.json({ msg: 'user login'});
})

module.exports = router;