var express = require('express');
var router = express.Router();

/* GET oauth. */
router.get('/', function(req, res) {
    console.log('GET REQUEST');
    console.log(req);
    res.sendStatus(200);
    //res.send('fblogin', {appId : process.env.APPLICATION_ID});
});


router.post('/', function(req, res) {
    console.log("POST REQUEST");
    console.log(req);
    res.sendStatus(200);
});

module.exports = router;
