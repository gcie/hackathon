var pgp = require('pg-promise')();

var Database = function() {
    this.db = pgp(process.env.DATABASE_URL);
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

// user: { psid }
Database.prototype.insertUser = function(user) {
    return this.db.none("INSERT INTO users(psid) VALUES (${psid});", user);
};

Database.prototype.deleteUser = function(user) {
    return this.db.none("DELETE FROM public.users WHERE psid=${psid}", user);
};

Database.prototype.getUser

Database.prototype.isUserTaken = function(user) {}