'use strict'

const request = require('request');
const express = require('express');
const router = express.Router();

var db = require('../models/database');

// for facebook verification
router.get('/', function (req, res) {
	if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		res.send('Error, wrong token');
	}
})

// to post data
router.post('/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;
		console.log(event);
		console.log(sender);
		db.checkUser(sender, found => {
			if(found) {
				if (event.message && event.message.text) {
					db.getUserMatch(sender).then(match => {
						if(match != null) {
							console.log("SENDING TO MATCH: " + event.message.text);
							sendTextMessage(match, event.message.text);
						} else {
							console.log("SENDING TO SENDER");
							sendTextMessage(sender, "Select \"Actions\" -> \"Find match\" from menu");
						}
					}).catch(err => {console.log("ERROR GETTING MATCH: " + err);});
				}
				if (event.postback) {
					console.log("POSTBACK");
					if(event.postback.payload == "FIND_MATCH") {
						// TODO
					} else if(event.postback.payload == "ABANDON") {
						// TODO
					}
				}
			} else {
				console.log("LOGIN REQUEST");
				sendLoginRequestMessage(sender);
			}
		}).catch(err => {console.log("ERROR CHECKING USER: " + err);});
	}
	res.sendStatus(200);
})

function sendLoginRequestMessage(sender, text) {	
	request({
		url: 'https://graph.facebook.com/v3.0/me/messages',
		qs: { access_token: process.env.PAGE_MSG_TOKEN },
		method: 'POST',
		json: {
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
								"title":"Welcome to Match!",
								"subtitle":"We have the right someone for everyone.",
								"image_url":"https://i.imgur.com/ts6E8AS.jpg",
								"default_action": {
									"type": "web_url",
									"url": "https://hackathon-gucci.herokuapp.com?psid=" + sender,
									"messenger_extensions": false,
									"webview_height_ratio": "compact"
								},
								"buttons":[ {
										"type":"web_url",
										"url":"https://hackathon-gucci.herokuapp.com?psid=" + sender,
										"title":"Login"
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


function sendTextMessage(sender, text) {
	console.log("Sending text message: " + text);

	let messageData = { text: text };
	
	request({
		url: 'https://graph.facebook.com/v3.0/me/messages',
		qs: { access_token: process.env.PAGE_MSG_TOKEN },
		method: 'POST',
		json: {
			messaging_type : 'RESPONSE',
			recipient: { id: sender },
			message: messageData,
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

module.exports = router;