var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('fblogin', {appId : process.env.APPLICATION_ID});
});

module.exports = router;
