var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.writeFile("/test", "Hey there!", function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
    res.render('index', { title: 'Express: ' + process.env.TITLE });
});

module.exports = router;
