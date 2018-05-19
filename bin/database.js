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

Database.prototype.insertUser = function(user) {
    user.username = user.username || null;
    return this.db.none("INSERT INTO public.users(" + 
        "email, password, username, created_at, last_login_at, " + 
        "sign_in_count, status, current_login_at, current_session_token, " + 
        "reminder_token, authentication_token, reminder_sent_at) VALUES (${email}, " + 
        "${password}, ${username}, ${createdAt}, ${lastLoginAt}, " + 
        "${signInCount}, ${status}, ${currentLoginAt}, ${currentSessionToken}, " + 
        "${reminderToken}, ${authenticationToken}, $reminderSentAt);",
    user);
};

Database.prototype.deleteUser = function(user) {
    return this.db.none("DELETE FROM public.users WHERE email=${email}", user);
};

Database.prototype.updateData = function(user) {
    return this.db.none("UPDATE public.users" + 
    "SET password=${password}, username=${username}, " + 
    "created_at=${createdAt}, last_login_at=${lastLoginAt}, " + 
    "sign_in_count=${signInCount}, status=${status}, " + 
    "current_login_at=${currentLoginAt}, current_session_token=${currentSessionToken}, " + 
    "reminder_token=${reminderToken}, authentication_token=${authenticationToken}, " +
	"reminder_sent_at=${reminderSentAt} WHERE email=${email};", user);
};
