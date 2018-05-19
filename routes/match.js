var express = require('express');
var router = express.Router();
var request = require('request');

/* GET /match. */
router.get('/', function(req, res, next) {

    request({
		url: 'https://graph.facebook.com/v3.0/me',
		qs: {
            access_token:'EAAZA1nyov6kIBAOthZC3zqicCQ4fYZCkPYahCvlQduxISp6AQNbwPIbgRmgTvUK9ZAyQQ331HrG7aFnyFDhoOBeMyyT7BOO49ZBU7A3ZABqgDFz2C5Ljoi2aY8Gf74GZBjkr7Srkm0TOy8HYkRcikWknubCtBE4s0HSsYTZBDH1XYiZCMkwZBEybaiLTZBn4sZCw4xgEFoTd5WZCj6YO1KGRj82ZB1v6beqoyNU5nunr2ytLayIAZDZD'
        },
		method: 'GET'
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
        }
        
        res.render('match', {appId : process.env.APPLICATION_ID, msg : "Wiadomość"});
        console.log(body);
    });
    
    

});

module.exports = router;
