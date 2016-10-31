/**
 * Created by acebisli on 30/10/16.
 */
'use strict';
function chatRoom()
{
    this._roomName='';
    this._roomId='';
    this._roomDesc = '';
    this._roomUsers = [];
    this._status = 'available'
    this._isPublic = true;
}

chatRoom.prototype.addPerson= function () {
    if (this.status == "available" && this._isPublic) {

    }
};

module.exports=chatRoom;