var pgp = require('pg-promise')();

var Database = (function() {
    var db;

    function init() {
        var cn = process.env.DATABASE_URL;
        if(cn == undefined) {
            cn = {
                host: 'localhost',
                port: 5432,
                database: 'postgres',
                user: 'gucci',
                password: 'gucci'
            };
        }
        return pgp(cn);
    }

    var get = function() {
        if(!db) {
            db = init();
        }
        return db;
    }

    return {
        get: get,
        checkUser: function(psid, next) {
            get();
            db.oneOrNone('SELECT token FROM users WHERE psid=$1;', psid)
            .then(function(token) {
                next(token !== null);
            });
        },
        getUserMatch: function(psid, next) {
            get();
            db.oneOrNone("SELECT int_psid FROM users WHERE psid=$1;", psid).then(data => next(data.int_psid));
        },
        getUserToken: function(psid, next) {
            get();
            db.oneOrNone("SELECT token FROM users WHERE psid=$1;", psid).then(data => next(data.token));
        },
        getWaitingUsers: function(next) {
            get();
            db.any("SELECT psid, token, int_psid FROM users WHERE waiting=$1;", true).then(data => next(data));
        },
        setInterlocutor: function(psid, int_psid, next) {
            get();
            db.none("UPDATE users SET int_psid=$1 WHERE psid=$2;", [int_psid, psid]).then(next);
        },
        getInterlocutor: function(psid, next) {
            get();
            db.none("SELECT int_psid FROM users WHERE psid=$1;", psid).then(next);
        },
        setWaiting: function(psid, waiting, next) {
            get();
            db.none("UPDATE users SET waiting=$1 WHERE psid=$2;", [waiting, psid]).then(next);
        },
        insertUser: function(user, next) {
            get();
            db.oneOrNone('SELECT token FROM users WHERE psid=${psid};', user)
            .then(token => {
                if(token === null) {
                    return db.none("INSERT INTO users(psid, token) VALUES (${psid}, ${token});", user);
                } else {
                    return db.none("UPDATE users SET token=${token} WHERE psid=${psid};", user);
                }
            }).then(next);
        },
        deleteUser: function(user, next) {
            get();
            db.none("DELETE FROM users WHERE psid=${psid}", user).then(next);
        }
    }
})();


module.exports = Database;