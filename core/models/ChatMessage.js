/**
 * Created by acebisli on 30/10/16.
 */
'use strict';

function chatMessage(userInfo,msg)
{
    this.user=userInfo;
    this.message=msg;
}

chatMessage.prototype.getUserId= function () {
    return this.user._userId;
}

module.exports=chatMessage;