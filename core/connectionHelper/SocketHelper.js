﻿'use strict';
var chatUser = require('../models/ChatUser');
var chatMessage = require('../models/ChatMessage');
var chatRoom = require('../models/ChatRoom');

//for helper methods
var _ = require('underscore');


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

    var rooms = [];
    var r1 = new chatRoom();
    r1._roomId = 1;
    r1._roomName = 'Ankara';
    r1._roomDesc = 'Ankara"nın bağları';
    rooms.push(r1);
    r1 = new chatRoom();
    r1._roomId = 2;
    r1._roomName = 'İstanbul';
    r1._roomDesc='İstanbul"un dağları';
    rooms.push(r1);
    r1 = new chatRoom();
    r1._roomId = 3;
    r1._roomName = 'Hatay';
    r1._roomDesc='Hatay"ın ovaları';
    rooms.push(r1);

    client.emit('all rooms', {allRooms: rooms});


    client.on('new message', function (s) {
        var _user = new chatUser();

        _user._userId = client.id;
        _user._userName = s._user._userName;

        var _chatMsg = new chatMessage(_user, s._message);
        _chatMsg._messageTime = '12:10 am';
        client.broadcast.emit('new message', _chatMsg);
    });
    // when the client emits 'add user', this listens and executes
    client.on('add user', function (data) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        client.username = data.username;
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
        var hasRoom = _.find(rooms, function (item) {
            return item._roomName == model._roomName;
        });
        if (!hasRoom) {
            var willbeAddedRoom = new chatRoom();
            willbeAddedRoom._roomId = model._roomId;
            willbeAddedRoom._roomName = model._roomName;
            willbeAddedRoom._roomDesc = model._roomDesc;
            rooms.push(willbeAddedRoom);

            client.emit('added room', willbeAddedRoom);
        }
    });
};
