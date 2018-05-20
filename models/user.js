var User = function(user_psid, user_token, interlocutor_psid, waiting) {
    return {
        psid: user_psid,
        token: user_token,
        int_psid: interlocutor_psid || null,
        waiting: waiting || false
    };
};

module.exports = User;