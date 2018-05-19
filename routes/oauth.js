var express = require('express');
var router = express.Router();
var Database = require('../models/database.js');
var User = require('../models/user.js');

/* GET oauth. */
router.get('/', function(req, res) {
    
    var user = User(req.query.psid, req.query.token);
    var db = new Database();
    db.insertUser(user);

    res.redirect(307, 'https://www.messenger.com/closeWindow/?image_url=&display_text=Login%20successful%2C%20you%20may%20close%20this%20page.');
});

router.post('/', function(req, res) {
    console.log("POST REQUEST");
    console.log(req);
    res.sendStatus(200);
});

module.exports = router;
