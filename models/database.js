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
            db.oneOrNone('SELECT token FROM users WHERE psid=$1', psid)
            .then(function(token) {
                next(token !== null);
            });
        },
        getUserMatch: function(psid, next) {
            get();
            db.oneOrNone("SELECT int_psid FROM users WHERE psid=$1", psid).then(data => next(data.int_psid));
        },
        getUserToken: function(psid, next) {
            get();
            db.oneOrNone("SELECT token FROM users WHERE psid=$1", psid).then(data => next(data.token));
        },
        getUsers: function(next) {
            get();
            db.any("SELECT psid, token, int_psid FROM users").then(data => next(data));
        },
        insertUser: function(user, next) {
            get();
            db.oneOrNone('SELECT token FROM users WHERE psid=${psid}', user)
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

/*
Database.prototype.checkUser = function(psid) {
    return new Promise(function(res, rej) {
        this.db.oneOrNone('SELECT token FROM users WHERE psid=$1', psid)
        .then(function(token) {
            res(token !== null);
        }, rej);
    });
};

Database.prototype.getUserMatch = function(psid) {
    return this.db.oneOrNone("SELECT int_psid FROM users WHERE psid=$1", psid);
}

Database.prototype.getUserToken = function(psid) {
    return this.db.oneOrNone("SELECT token FROM users WHERE psid=$1", psid);
}

Database.prototype.getUsers = function() {
    return this.db.any("SELECT psid, token, int_psid FROM users");
}

Database.prototype.insertUser = function(user) {
    return this.db.oneOrNone('SELECT token FROM users WHERE psid=${psid}', user)
    .then(token => {
        if(token === null) {
            return this.db.none("INSERT INTO users(psid, token) VALUES (${psid}, ${token});", user);
        } else {
            return this.db.none("UPDATE users SET token=${token} WHERE psid=${psid};", user);
        }
    });
};

Database.prototype.deleteUser = function(user) {
    return this.db.none("DELETE FROM public.users WHERE psid=${psid}", user);
};
*/

module.exports = Database;