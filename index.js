const path=require('path');
const express=require('express');
const app =express();
const socketio=require('socket.io');
app.use(express.static(path.join(__dirname,'public')))
const port=3000||process.env.port;
const http=require('http');
const server=http.createServer(app);
const io =socketio(server);
const formatMessage=require('./utils/messages');

const { userJoin, getCurrnetUser ,getRoomUsers,userLeave} = require('./utils/users');

const botname='admin jox'
//run when user concted
io.on('connection',(socket)=>{
    // console.log('new user conected');
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',  formatMessage(botname,'welcome to my chat') );
        //ignore himself
        socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username}  joined   `))
    //send user and room info 
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })

    })

    socket.on('chatMessage',(msg)=>{
        //console.log(msg);
        const user=getCurrnetUser(socket.id);
              io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

      //run when user left chat
      socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,` ${user.username} left the chat`));
                //send user and room info 
       io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })
        }
     
    })
   

})



server.listen(port,()=>{
    console.log(`server runing on ${port}`)
})