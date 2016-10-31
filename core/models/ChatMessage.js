/**
 * Created by acebisli on 30/10/16.
 */
'use strict';

function chatMessage(userInfo, msg) {
    this._user = userInfo;
    this._message = msg;
    this._messageTime = '';
}

chatMessage.prototype.getUserId = function () {
    return this._user;
}

module.exports = chatMessage;