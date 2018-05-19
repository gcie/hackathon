var User = function(user_psid, interlocutor_psid) {
    return {
        psid: user_psid, 
        int_psid: interlocutor_psid || null
    };
};

module.exports = User;