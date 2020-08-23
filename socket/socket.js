var Util = require('./util');
var User_manager = require('./user_manager');

function Socket(server) {
    var io = require('socket.io')(server);

    //I create 'userManager' to manage all user data.
    var userManager = new User_manager.UserManager();
    
    io.on('connection', function(socket) {
        var session_id;

        /*
        When socket disconnected.
        */
        socket.on('disconnect', function() {
            if(session_id) {
                userManager.disconnectedUser(session_id);
                userManager.reqestDeleteUser(session_id);
            }
        });

        /*
        Check a nickname that user typed is using by other user.
        */
        socket.on('check_name', function(inp_name) {
            if(userManager.checkUserName(inp_name)) {
                socket.emit('check_name', true);
            } else {
                socket.emit('check_name', false);
            }
        });

        /*
        Create User
        */
        socket.on('create_user', function(inp_name) {
            var tmp_socket_id = Util.createSessionID();
            if(userManager.createUser(tmp_socket_id, inp_name, socket.id)) {
                socket.emit('create_user', true, tmp_socket_id);
            } else {
                socket.emit('create_user', false, '');
            }
        });

        /*
        When web page's location is changed or reloaded, session trying to connect with server again.
        */
        socket.on('session_resume', function(inp_session_id) {
            if(userManager.getUser(inp_session_id)) {
                session_id = inp_session_id;
                userManager.resumeUser(session_id, socket.id);
                userManager.cancelDeleteUser(session_id);
                socket.emit('session_resume', true);
            } else {
                socket.emit('session_resume', false);
            }
        });

        ///////////////////////////////
        //People, Message, Information page
        ///////////////////////////////

        /*
        Server provide to client the data like my name, people's name list etc.
        */
        socket.on('request_data', function(inp_session_id, location, chat_id) {
            if(session_id == inp_session_id) {
                var my_name = userManager.getUser(inp_session_id)[1];

                if(location == 'people') {
                    var connected_user = {};
                    var all_user_data = userManager.getAllData();
                    for(var key in all_user_data) {
                        if(all_user_data[key][0]) {
                            connected_user[key] = all_user_data[key];
                        }
                    }
                    socket.emit('request_data', true, my_name, connected_user);
                    return;
                } else if(location == 'chat') {
                    if(userManager.getUser(chat_id)) {
                        socket.emit('request_data', true, userManager.getUser(chat_id)[1]);
                        return;
                    }
                } else if(location == 'message') {
                    var result = {};
                    var my_data = userManager.getUser(session_id);

                    for(var i = 3; i < my_data.length; i++) {
                        result[my_data[i]] = userManager.getUser(my_data[i])[1];
                    }
                    socket.emit('request_data', true, my_name, result);
                    return;
                }

                socket.emit('request_data', false);
            } else {
                socket.emit('request_data', false);
            }
        });

        /*
        When user request to change the nickname it would be running.
        */
        socket.on('change_my_nickname', function(inp_session_id, new_nickname) {
            if(session_id == inp_session_id) {
                if(userManager.checkUserName(new_nickname) && userManager.changeUserName(session_id, new_nickname)) {
                    socket.emit('change_my_nickname', true);
                } else
                    socket.emit('change_my_nickname', false);
            } else
                socket.emit('change_my_nickname', false);
        });

        /*
        When user want to chat other
        */
        socket.on('connect_two_user', function(inp_from_session_id, inp_to_session_id) {
            userManager.connectEachUser(inp_from_session_id, inp_to_session_id);
        });

        /*
        Disconnect connection each of two user
        */
        socket.on('disconnect_two_user', function(inp_from_session_id, inp_to_session_id) {
            userManager.disconnectEachUser(inp_from_session_id, inp_to_session_id);
        });

        /*
        When user send a message to other user.
        */
        socket.on('msg_user', function(inp_from_session_id, inp_to_session_id, msg) {
            if(userManager.connectionCheck(inp_from_session_id, inp_to_session_id)) {
                socket.broadcast.to(userManager.getUser(inp_to_session_id)[2]).emit('msg_user', inp_from_session_id, msg);
                socket.emit('msg_user_result', true);
                return;
            }
            socket.emit('msg_user_result', false);
        });
    });
}

exports.Socket = Socket;