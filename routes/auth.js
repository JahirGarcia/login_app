const express= require('express');
const router = express.Router();
const passport = require('passport');
const fetch = require('node-fetch');

router.get('/signup', async (req, res, next) => {
	const countries = await fetch('https://restcountries.eu/rest/v2/all?fields=name').then(res => res.json());

	res.render('auth/signup', {
		title: 'Sign Up',
		csrfToken: req.csrfToken(),
		message: req.flash('message'),
		countries
	});
});

router.post('/signup', passport.authenticate('localSignup', {
	successRedirect: '/',
	failureRedirect: '/auth/signup',
	passReqToCallback: true
}));

router.get('/signin', (req, res, next) => {
	res.render('auth/signin', {
		title: 'Sign In',
		csrfToken: req.csrfToken(),
		message: req.flash('message')
	});
});

router.post('/signin', passport.authenticate('localSignin', {
	successRedirect: '/',
	failureRedirect: '/auth/signin',
	passReqToCallback: true
}));

router.get('/signout', (req, res, next) => {
	req.logout();
	res.redirect('/auth/signin');
});

module.exports = router;