const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'Home'
	});
});

router.get('/translate', (req, res, next) => {
	res.render('translate', {
		title: 'Translate'
	});
});

module.exports = router;