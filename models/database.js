var pgp = require('pg-promise')();

var Database = function() {
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
    this.db = pgp(cn);
    return this;
};

Database.prototype.checkUser = function(user) {
    return new Promise(function(res, rej) {
        this.db.oneOrNone('SELECT id FROM public.users WHERE email=${email}', user)
        .then(function(id) {
            res(id !== null);
        }, rej);
    });
};

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

module.exports = Database;