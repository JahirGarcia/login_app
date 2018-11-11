const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	gender: String,
	name: {
		first: String,
		last: String
	},
	location: {
		street: String,
		city: String,
		state: String,
		country: String
	},
	email: String,
	login: {
		username: String,
		password: String,
	},
	dob: {
		date: String,
		age: Number
	},
	phone: String,
	cell: String
}, {
	timestamps: true
});

userSchema.statics.encryptPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.login.password);
};

module.exports = mongoose.model('User', userSchema);