var express = require('express');
var router = express.Router();
var request = require('request');

var testUserToken = 'EAACEdEose0cBAHNUGZBlBFoDRQAwkQAyK1BkmdLYcZAjG18iSAeehpWNDtF8e410kOAwT9kQ3Cg8xZCjyZC1x9XR6LYPpJJkxvwiMwsONb42PMtbXf3QfiAesO0fVrQFEvp7TblmLTMUJp3HfknJl04K50Fcxyib0eIwRsvSMC8cPorrNOSmpDqzMPS3J2LfzFc9wzUByQZDZD';


function f(x, y)
{
    return 42;
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
			res(body);
		});
	})
	
}

/* GET /match. */
router.get('/', function(req, res, next) {
	(async function() {
		var address = await getUserFields(testUserToken, 'address');
		var age_range = await getUserFields(testUserToken, 'age_range');
		var birthday = await getUserFields(testUserToken, 'birthday');
		var education = await getUserFields(testUserToken, 'education');
		var favorite_athletes = await getUserFields(testUserToken, 'favorite_athletes');
		var favorite_teams = await getUserFields(testUserToken, 'favorite_teams');
		var gender = await getUserFields(testUserToken, 'gender');
		var hometown = await getUserFields(testUserToken, 'hometown');
		var languages = await getUserFields(testUserToken, 'languages');
		var link = await getUserFields(testUserToken, 'link');
		var location = await getUserFields(testUserToken, 'location');
		var quotes = await getUserFields(testUserToken, 'quotes');
		var sports = await getUserFields(testUserToken, 'sports');
		var books = await getUserFields(testUserToken, 'books');
		var friends = await getUserFields(testUserToken, 'friends');
		var events = await getUserFields(testUserToken, 'events');
		var games = await getUserFields(testUserToken, 'games');
		var likes = await getUserFields(testUserToken, 'likes');
		var movies = await getUserFields(testUserToken, 'movies');
		var music = await getUserFields(testUserToken, 'music');
		var television = await getUserFields(testUserToken, 'television');
        
        var user = await getUserFields(testUserToken, 'address,age_range,birthday,education,favorite_athletes,favorite_teams,gender,hometown,languages,link,location,quotes,sports,books,friends,events,games,likes,movies,music,television');
        
		
		console.log(location);
        res.send(String(user));
	})();
});

module.exports = router;
