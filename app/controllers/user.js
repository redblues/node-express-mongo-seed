var async		= require('async');
var User 		= require('../models/User');
var constants 	= require('../utils/constants');

exports.signup = function(req, res){
	console.log('user.signup');

	var email 		 	= req.body.email;
  	var firstName 	 	= req.body.firstName;
  	var lastName	 	= req.body.lastName;
  	var password 	 	= req.body.password;

  	if (!email || !firstName || !lastName || !password){
		return handleError(res, {
			status: 400,
			message: 'Missing parameters'
		})	
	}
	var params = {
		email		: email,
		firstName	: firstName,
		lastName	: lastName,
		password 	: password
	}

	async.waterfall([

		function createUser(next){
			User.signup(params, next);
		},
		function createSession(user, next){
			user.createSession(function (token){
				res.setHeader(constants.AUTH_TOKEN, token);//add as header
				next(null, user);
			})
		}
	],
	function (err, user){
		if(err) return handleError(res, err); 

		res.json({
			user: user
		});
	})
	
}

function handleError(res, err){
	var status = err.status || 500;
	res.status(status);
	return res.json({
		errors: [err]
	});
};