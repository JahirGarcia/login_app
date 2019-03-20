const express = require('express');
const router = express.Router();

router.get('/games', (req, res, next) => {
  res.render('landing/games', {
    title: 'Landing Pages - Games'
  });
});

module.exports = router;
