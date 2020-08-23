/*
Create Session ID randomly
*/
function createSessionID() {
    var session_id = '';
    for(var i = 0; i < 10; i++) {
        var tmp_random = Math.random();
        session_id = session_id + Math.floor(tmp_random * 16).toString(16);
    }

    return session_id;
}

exports.createSessionID = createSessionID;