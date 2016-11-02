/**
 * Created by acebisli on 27/10/16.
 */
$(function () {
    
    var FADE_TIME = 150; // ms
    
    // Initialize variables
    var $window = $(window);
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('#txtMessage'); // Input message input box
    
    // Prompt for setting a username
    var username = 'cabbar';
    var connected = false;
    
    var socket = io();
    
    if (socket) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        log(message, {
            prepend: true
        });
        getUserName();
        if (username && username != "") {
            var connectedUser = {
                id: socket.id,
                username: username
            };
            setUsername(connectedUser);
            addParticipantsMessage({ numUsers: 1 });
        }
    }
    
    function getUserName() {
        //var person = prompt("İsminizi Giriniz");
        //if (person != null && person != "") {
        //    username = person;
        //    return username;
        //} else {
        //    getUserName();
        //}
        
        username = $("#hdnUserName").val();
    }
    
    
    function addParticipantsMessage(data) {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        message += "Connected User => " + data.username;
        log(message);
    }
    
    // Sets the client's username
    function setUsername(user) {
        socket.emit('add user', username);
    }
    
    // Sends a chat message
    function sendMessage() {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            var msgObj = {
                _user: {
                    _userId: 'asda',
                    _userName: username
                },
                _message: message,
                _messageTime: '12:25 am'
            };
            
            addChatMessage(msgObj);
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', msgObj);
        }
    }
    
    // Log a message
    function log(message, options) {
        console.log(message);
    }
    
    // Adds the visual chat message to the message list
    function addChatMessage(data) {
        var tempHtml = _.template($("#msgBody").html());
        $('.msg-wrap').append(tempHtml(data));
    }
    
    // Prevents input from having injected markup
    function cleanInput(input) {
        $inputMessage.val('');
    }
    
    function addRoom(data) {
        var tempHtml = _.template($("#roomTemplate").html());
        $('.conversation-wrap').append(tempHtml({ rooms : data.allRooms }));
    }
    
    
    $window.keydown(function (event) {
        if (event.which === 13 || event.which == 8) {
            sendMessage();
        }
    });
    
    // Focus input when clicking on the message input's border
    $inputMessage.click(function () {
        $inputMessage.focus();
    });
    
    // Socket events
    
    //willAddedNew Room
    socket.on('added room', function (data) {
        addRoom(data);
    });
    
    // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });
    
    socket.on('all rooms', function (data) {
        addRoom(data);
    });
    
    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
        addChatMessage(data);
    });
    
    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
        log(data.username + ' joined');
        addParticipantsMessage(data);
    });
    
    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
        log(data.username + ' left');
        addParticipantsMessage(data);

    });
});