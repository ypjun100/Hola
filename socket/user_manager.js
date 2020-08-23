function UserManager() {
    //User Data Information : user_data[session_id] -> status, nickname, socket_id
    user_data = {};
    delete_user_data_queue = {};
    username_max_length = 10;

    //Create User Data to the 'user_data'
    this.createUser = function(inp_session_id, inp_nickname, socket_id) {
        if(inp_nickname) {
            if(inp_nickname.length <= username_max_length) {
                user_data[inp_session_id] = [true, inp_nickname, socket_id];
                return true;
            } else
                return false;
        }
        else
            return false;
    }

    //Change user's state to 'false'
    this.disconnectedUser = function(inp_session_id) {
        if(user_data[inp_session_id])
            user_data[inp_session_id][0] = false;
    }

    //Change user's state to 'true'
    this.resumeUser = function(inp_session_id, socket_id) {
        if(user_data[inp_session_id]) {
            user_data[inp_session_id][0] = true;
            user_data[inp_session_id][2] = socket_id;
        }
    }

    //Check user name is avail to use.
    this.checkUserName = function(inp_nickname) {
        for(var key in user_data) {
            if(inp_nickname == user_data[key][1]) {
                return false;
            }
        }
        return true;
    }

    //Get User Data
    this.getUser = function(inp_session_id) {
        return user_data[inp_session_id];
    }

    //Change UserName
    this.changeUserName = function(inp_session_id, new_nickname) {
        if(new_nickname) {
            if(new_nickname.length <= username_max_length) {
                user_data[inp_session_id][1] = new_nickname;
                return true;
            } else
                return false;
        }
        else
            return false;
    }

    //Get All Data
    this.getAllData = function() {
        return Object.assign({}, user_data);
    }

    //Connect each user for chat
    this.connectEachUser = function(inp_from_session_id, inp_to_session_id) {
        if(user_data[inp_from_session_id])
            if(user_data[inp_from_session_id].indexOf(inp_to_session_id) == -1)
                user_data[inp_from_session_id].push(inp_to_session_id);

        if(user_data[inp_to_session_id])
            if(user_data[inp_to_session_id].indexOf(inp_from_session_id) == -1)
                user_data[inp_to_session_id].push(inp_from_session_id);
    }

    //Disconnect each user
    this.disconnectEachUser = function(inp_from_session_id, inp_to_session_id) {
        if(user_data[inp_from_session_id])
            var loc_from = user_data[inp_from_session_id].indexOf(inp_to_session_id);
        else var loc_from = -1;
        if(user_data[inp_to_session_id])
            var loc_to = user_data[inp_to_session_id].indexOf(inp_from_session_id);
        else var loc_to = -1;

        if(loc_from != -1)
            user_data[inp_from_session_id].splice(loc_from, loc_from);

        if(loc_to != -1)
            user_data[inp_to_session_id].splice(loc_to, loc_to);
    }

    //Check two users connect each other.
    this.connectionCheck = function(inp_from_session_id, inp_to_session_id) {
        if(user_data[inp_from_session_id] && user_data[inp_to_session_id])
            if(user_data[inp_to_session_id][0] == true && 
                user_data[inp_from_session_id].indexOf(inp_to_session_id) != -1 &&
                user_data[inp_to_session_id].indexOf(inp_from_session_id) != -1)
                return true;
        return false;
    }

    

    /*
    If user doesn't connect in 1 min, server delete user data.
    But if user's connection is reconnected again, 
    the deleting method in 'delete_user_data_queue' will be delete and 'setTimeout' function will be disable.
    */
    this.reqestDeleteUser = function(inp_session_id) {
        if(!delete_user_data_queue[inp_session_id]) {
            delete_user_data_queue[inp_session_id] = setTimeout(function() {
                if(user_data[inp_session_id])
                    if(!user_data[inp_session_id][0]) {
                        //Delete connection
                        for(var i = 3; i < user_data[inp_session_id].length; i++) {
                            var loc_to_delete = user_data[user_data[inp_session_id][i]].indexOf(inp_session_id);
                            user_data[user_data[inp_session_id][i]].splice(loc_to_delete, loc_to_delete);
                        }

                        delete user_data[inp_session_id];
                        delete delete_user_data_queue[inp_session_id];
                    }
            }, 1 * 60 * 1000);
        }
    }

    /*
    Disable setTimoutout function
    */
    this.cancelDeleteUser = function(inp_session_id) {
        if(delete_user_data_queue[inp_session_id]) {
            clearTimeout(delete_user_data_queue[inp_session_id]);
            delete delete_user_data_queue[inp_session_id];
        }
    }
}
exports.UserManager = UserManager;