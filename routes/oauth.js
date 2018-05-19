var express = require('express');
var router = express.Router();

/* GET oauth. */
router.get('/', function(req, res, next) {
  res.send('fblogin', {appId : process.env.APPLICATION_ID});
});


router.post('/', function(req, res) {
    
});

module.exports = router;
