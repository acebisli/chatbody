'use strict';

module.exports = SocketHelper;
var Rooms = [];
var numUsers = 0;

function SocketHelper(server) {
    this.io = require('socket.io').listen(server);
    this.io.on('connection', this.onConnection);
    console.log("connection socket ctor");
}

SocketHelper.prototype.onConnection = function (client) {
    console.log("connection socket");
    var addedUser = false;
    
    client.on('new message', function (s) {
        client.broadcast.emit('new message', {
            username: client.username,
            message: s
        });
    });
    // when the client emits 'add user', this listens and executes
    client.on('add user', function (username) {
        if (addedUser) return;
        
        // we store the username in the socket session for this client
        client.username = username;
        ++numUsers;
        addedUser = true;
        client.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        client.broadcast.emit('user joined', {
            username: client.username,
            numUsers: numUsers
        });
    });
    // when the client emits 'typing', we broadcast it to others
    client.on('typing', function () {
        client.broadcast.emit('typing', {
            username: client.username
        });
    });
    
    // when the client emits 'stop typing', we broadcast it to others
    //
    client.on('stop typing', function () {
        client.broadcast.emit('stop typing', {
            username: client.username
        });
    });
    
    // when the user disconnects.. perform this
    client.on('disconnect', function () {
        if (addedUser) {
            --numUsers;
            
            // echo globally that this client has left
            client.broadcast.emit('user left', {
                username: client.username,
                numUsers: numUsers
            });
        }
    });
    
    client.on('add room', function (model) {
        User.find({ name: model.name }, function (err, rooms) {
            if (err) throw err;
            else {
                client.broadcast.emit('add room', { hasRoom: true });
            }
        })
    });


};
