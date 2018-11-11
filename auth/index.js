const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = () => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => {
			done(null, user);
		}).catch(err => {
			done(err);
		});
	});

	passport.use('localSignup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		User.findOne({ email }).then(user => {
			if(user) {
				return done(null, false, req.flash('message', 'el email ya existe'));
			} else {
				User.create({
					gender: req.body.gender,
					name: {
						first: req.body.firstName,
						last: req.body.lastName
					},
					location: {
						street: req.body.street,
						city: req.body.city,
						state: req.body.state,
						country: req.body.country
					},
					email: email,
					login: {
						username: req.body.username,
						password: User.encryptPassword(password)
					},
					dob: {
						date: req.body.date,
						age: req.body.age
					},
					phone: req.body.phone,
					cell: req.body.cell
				}).then(user => {
					return done(null, user);
				}).catch(err => {
					return done(err);
				});
			}
		}).catch(err => {
			return done(err);
		});
	}));
	
	passport.use('localSignin', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		User.findOne({ email }).then(user => {
			if(!user) {
				return done(null, false, req.flash('message', 'El email es incorrecto'));
			} else {
				if(user.comparePassword(password)) {
					return done(null, user);
				} else {
					return done(null, false, req.flash('message', 'La contraseña es incorrecta'));
				}
			}
		}).catch(err => {
			return done(err);
		});
	}));
};
