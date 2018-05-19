'use strict'

const request = require('request');
const express = require('express');
const router = express.Router();

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
		if (event.message && event.message.text) {
			let text = event.message.text;
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback);
			sendTextMessage(sender, "Postback received: " + text.substring(0, 200));
			continue;
		}
	}
	res.sendStatus(200);
})


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