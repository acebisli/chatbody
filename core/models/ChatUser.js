/**
 * Created by acebisli on 30/10/16.
 */
'use strict';

function chatUser() {
    this._userId ='';
    this._userName='';
}

chatUser.prototype.getUserName= function (id) {
    return this._userName;
};

module.exports=chatUser;