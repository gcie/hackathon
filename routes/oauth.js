var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../models/database.js');
var User = require('../models/user.js');

/* GET oauth. */
router.get('/', function(req, res) {
    
    var user = User(req.query.psid, req.query.token);
    db.insertUser(user);

    sendMatchQuestion(req.query.psid, "Login successful! ", "Would you like to find your first match?");

    res.redirect(307, 'https://www.messenger.com/closeWindow/?image_url=https%3A%2F%2Fi.imgur.com%2Fts6E8AS.jpg&display_text=Login%20successful%2C%20you%20may%20close%20this%20page.');
});

router.post('/', function(req, res) {
    console.log("POST REQUEST");
    console.log(req);
    res.sendStatus(200);
});

module.exports = router;

function sendMatchQuestion(sender, text, subtext){	
	request({
		url: 'https://graph.facebook.com/v3.0/me/messages',
		qs: { access_token: process.env.PAGE_MSG_TOKEN },
		method: 'POST',
		json: {
			messaging_type : 'RESPONSE',
			"recipient":{
			  	"id": sender
			},
			"message":{
				"attachment":{
					"type":"template",
					"payload":{
						"template_type":"generic",
						"elements":[
							{
								"title": text,
								"subtitle": subtext,
								
								"buttons":[ {
										"title": "Find a match",
										"type": "postback",
										"payload": "FIND_MATCH"
									}]      
							}
						]
					}
				}
			}
		}
		  
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
		console.log(body);
	});
}