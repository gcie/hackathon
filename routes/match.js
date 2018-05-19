var express = require('express');
var router = express.Router();
var request = require('request');

var testUserToken = 'EAACEdEose0cBAE4lqhXf5jqSp58xiFLhQul2e4pe5d8W7h8xWhj1U07EruMfLw5Np2otLtMp727ZBDjSMW67Li0ZCN5KdXkZCJYHex9kOugZBv3t5BMvE7k4XvykSSRXaB7sF0yVEd4cOMt8ZBwyNWFLZCBLEq7UpVZCv2RS2h03ZAcRC2YryMlljnKdqXhORGwfRibZCsuVBbQZDZD';


function f(x, y)
{
    var score = 0;
    if(x.hometown == y.hometown)
        score ++;
    
   // for (var m in x.music)
   //    if(x.music[m] )
       
    s=""
   
    var a1 = [];    
    
    for(var field in x)
    {   /*
        if (x[field].data instanceof Array)
            for (var e in field.data)
                a1.push(x[field].data[e].name);
            */
        s += "sd"   
        //a.push(String(x[field].data));
    }
    
    var a2 = [];  
    for (var e in y.music.data)
        a2.push(y.music.data[e].name);
    
    a1.sort();
    a2.sort();
    
    
    return a1;
    
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
        /*
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
		var television = await getUserFields(testUserToken, 'television');*/
        
        var user = await getUserFields(testUserToken, 'address,age_range,birthday,education,favorite_athletes,favorite_teams,gender,hometown,languages,link,location,quotes,sports,books,friends,events,games,likes,movies,music,television');
        user = JSON.parse(user);
		
		//console.log(location);
        var a = [];
        
        for (var e in user.music.data)
            a.push(user.music.data[e].name);
        
        s = ""
        for (var e in user)
            for(var x in user[e].data)
                s += user[e].data[x].name + " ";
        
        //res.send(String(user.music.data instanceof Array));
        res.send(s);
        //res.send(String(f(user, user)));
	})();
});

module.exports = router;
