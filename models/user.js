var User = function(user_psid, user_token, interlocutor_psid) {
    return {
        psid: user_psid,
        token: user_token,
        int_psid: interlocutor_psid || null
    };
};

module.exports = User;