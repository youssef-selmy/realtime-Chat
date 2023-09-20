const users=[];

//join user to chat
function userJoin(id,username,room){
    const user={id,username,room};
    users.push(user);
    return user;
}


function userLeave(id){
    const index=users.findIndex(user=>user.id===id);
    if(index !==-1){
        return users.splice(index,1)[0];
    }
}
//get cur user
function getCurrnetUser(id){
    return users.find(user=>user.id===id);
}
function getRoomUsers(room){
    return users.filter(user=>user.room===room)
}

module.exports={
    userJoin,
    getCurrnetUser,
userLeave,
getRoomUsers
}