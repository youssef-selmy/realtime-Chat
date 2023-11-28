const path = require("path");
const express = require("express");
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const authRoute=require('./routes/authRoute')

const socketio = require("socket.io");
const rateLimit = require('express-rate-limit');
const DB=require('./config/DB');
DB();
const app = express();
const port = 3000 || process.env.PORT;
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
  });

app.use(express.static(path.join(__dirname, "public")));



// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
      'Too many accounts created from this IP, please try again after an hour',
  });
  // Apply the rate limiting middleware to all requests
app.use('/api', limiter);



const {
  userJoin,
  getCurrnetUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

const botname = "admin jox";
//run when user concted
io.on("connection", (socket) => {
  // console.log('new user conected');
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botname, "welcome to my chat"));
    //ignore himself
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botname, `${user.username}  joined   `));
    //send user and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    //console.log(msg);
    const user = getCurrnetUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

//   io.on('connection', (socket) => {
//     socket.on('fileMessage', ({ message, fileData }) => {
//       // Broadcast the file message to everyone in the room
//       io.to(socket.room).emit('fileMessage', {
//         username: socket.username,
//         message,
//         fileData,
//       });
//     });
  
    
//   });

  //run when user left chat
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botname, ` ${user.username} left the chat`)
      );
      //send user and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`server runing on ${port}`);
});
