'use strict'

const request = require('request');
const express = require('express');
const router = express.Router();
var match = require('./match.js');

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
					db.getUserMatch(sender, match => {
						if(match != null) {
							sendTextMessage(match, event.message.text);
						} else {
							sendTextMessage(sender, "Select \"Actions\" -> \"Find match\" from menu");
						}
					});
				}
				if (event.postback) {
					if(event.postback.payload == "FIND_MATCH") {
						console.log("MATCHING");
						match(sender, (int_psid, similarities) => {
							console.log("MATCHED with: " + int_psid);
							if(int_psid == -1) {
								db.setWaiting(sender, true);
							} else {
								db.setInterlogator(sender, int_psid);
								db.setInterlogator(int_psid, sender);
								db.setWaiting(int_psid, false);
								sendTextMessage(int_psid, "We found you a match!");
								sendTextMessage(sender, "We found you a match!");
							}
						});
					} else if(event.postback.payload == "ABANDON") {
						db.setWaiting(sender, false);
						db.getInterlogtor(sender, int_psid => {
							if(int_psid != null) {
								sendTextMessage(int_psid, "Your match left the conversation!");
								db.setInterlogator(int_psid, null);
							}
							db.setInterlogator(sender, null);
						});
					}
				}
			} else {
				sendLoginRequestMessage(sender);
			}
		});
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