var express = require('express');
var router = express.Router();
var request = require('request');
var Database = require('../models/database')
var db = new Database();

var fields = 'address,age_range,birthday,education,favorite_athletes,favorite_teams,gender,hometown,languages,link,location,quotes,sports,books,friends,events,games,likes,movies,music,television';

function getAllUsers() {
	return db.getUsers();
}

function Queue() {
	this.data = [];
}
  
Queue.prototype.add = function(record) {
	this.data.unshift(record);
}
  
Queue.prototype.remove = function() {
	this.data.pop();  
}

Queue.prototype.empty = function() {
	return this.data.length == 0;
}
    
Queue.prototype.first = function() {
	return this.data[0];  
}
    
Queue.prototype.last = function() {  
	return this.data[this.data.length - 1];
}
 
Queue.prototype.size = function() {
	return this.data.length;
}

function getFriends(user) { // user by psid
	var db = new Database();
	var userToken = db.getUserToken(user);
	//var userToken = ? find user token here
	var friends = getUserFields(user, 'friends');
	// find friends ids in database
	return undefined;
}

// k is a maximum distance in relationship between fixed user and others
function getKUsers(user, k) {
	const q = new Queue;
	q.add(user);

	var dict = {};

	while (!q.empty()) {
		var elem = q.first;
		depth = dict[elem];
		if (depth && depth == k) {
			var arr = [];
			for (var elem in dict) {
				if (elem == k - 1) {
					arr.push(elem);
				}
			}
			return arr;
		}
		q.remove();

		var friends = getFriends(users);
		for (var friend in friends) {
			if (!dict[friend]) {
				q.add(friend);
				dict[friend] = dict[elem] + 1;
			}
		}
	}
}

function findOptimalUser(userToPair) {
	var users = getUsers();
	var maximum = 0;
	var maximumUser = undefined;
	for (var user in users) {
		var heuroVal = compareUsers(user, userToPair);
		if (heuroVal > maximum) {
			maximum = heuroVal;
			maximumUser = user;
		}
	}

	return maximumUser;
}

function compareUsers(user1, user2) {
	var similarity = 0
    var similarities = {}
	for (var key in user1) {
		var weight = Math.floor(Math.random() * 5 + 1);
		try {
            console.log(key)
			var arr1 = user1[key].data.sort(function (a, b){return a.name < b.name});
			var arr2 = user2[key].data.sort(function (a, b){return a.name < b.name});
           // console.log(user2[key].paging);             
		}catch(exception) {
            //console.log(key)
           // console.log(exception)
            if(user2[key] == undefined)
                continue;
            
            if(user1[key] instanceof Array && user2[key] instanceof Array) {
                var arr1 = user1[key].sort(function (a, b){return a.name < b.name});
                var arr2 = user2[key].sort(function (a, b){return a.name < b.name});
            }
            else if (key === "age_range")
                console.log("age");
            else if(key === "birthday")
                console.log("bday");
            else if(user1[key].hasOwnProperty('name'))
                if (user1[key].name == user2[key].name) {
                    similarity += weight;
                    similarities[key] = [user2[key].name];
                }
            else
                if (user1[key] == user2[key]) {
                    similarity += weight;
                    similarities[key] = [user2[key]];
                }
            /*
			if (user1[key].name == user2[key].name) {
				similarity += weight;
                similarities[key] = [user2[key]];
			}*/
            
            if(!(user1[key] instanceof Array && user2[key] instanceof Array))
                continue;
		}
        
        var matching = []

		var l = 0;
		var r = 0;
		var count = 0;
		for (; l < arr1.length && r < arr2.length;) {
            //console.log(arr1[l])
			if (arr1[l].name == arr2[r].name) {
				count++;
			
                matching.push(arr2[r].name);
                l++; r++;
			}
			else if (arr1[l].name < arr2[r].name) {
				l++;
			}
			else if (arr1[l].name > arr2[r].name) {
				r++;
			}
		}
        
        if(matching.length > 0)
            similarities[key] = matching

		similarity = similarity + (count * weight);
	}
   
	return {
		similarity: similarity, 
		similarities: similarities
	};
}

function getUserFields(userToken, field, next) {
	return new Promise((res, rej) => {
		request({
			url: 'https://graph.facebook.com/v3.0/me?fields=' + field,
			//'address,age_range,birthday,favorite_athletes,favorite_teams,gender,hometown,inspirational_people,languages'
			qs: {
				access_token: userToken
			},
			method: 'GET'
		}, function(error, response, body) {
			if (error) {
				console.log('Error sending messages: ', error);
				rej(error);
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
				rej(error);
			}
			res(JSON.parse(body));
		});
	})
	
}

function pairUser(user_psid) {
	return new Promise((res, rej) => {
		db.getUserToken(user_psid).then(user_token => {
			getUserFields(user_token.token, fields).then(user_data => {
				getAllUsers().then(users => {
					max = -1;
					maxSimiliarities = {};
					maxUser = {};
					for (var user of users) {
						if (user.psid == user_psid) continue;
						getUserFields(user.token, fields).then(userData2 => {
							var sim = compareUsers(user_data, userData2);
							if (sim.similarity > max) {
								max = sim.similarity;
								maxSimiliarities = sim.similarities;
								maxUser = user;
							}
						});
					}		
		
					res(maxUser.psid, maxSimiliarities);
				});
			})
		})
	})	
}

/* GET /match. */
router.get('/', function(req, res, next) {
	pairUser(userToken).then((user, similarities) => {
		console.log(user);
		console.log(similarities);
	})

	res.route.query.user = user;
	res.route.query.similarities = similarities;
});

module.exports = router;
