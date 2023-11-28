const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const fileInput = document.getElementById('file-input');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });
/////////////////////////////////////////
// // Existing code...

// // Message submit with file
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const msg = e.target.elements.msg.value.trim();
//   const file = fileInput.files[0]; // Get the selected file

//   if (!msg && !file) {
//     return false; // If both message and file are empty, exit
//   }

//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const fileData = event.target.result; // Get file data (base64 encoded)
//       socket.emit('fileMessage', { username, message: msg, fileData }); // Emit file message
//     };
//     reader.readAsDataURL(file); // Read file as data URL
//   } else {
//     socket.emit('chatMessage', msg); // Emit regular chat message without file
//   }

//   // Clear input
//   e.target.elements.msg.value = '';
//   fileInput.value = ''; // Clear file input
//   e.target.elements.msg.focus();
// });

// // File message from server
// socket.on('fileMessage', (fileMessage) => {
//   const div = document.createElement('div');
//   div.classList.add('message');

//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = fileMessage.username;
//   p.innerHTML += `<span>${fileMessage.time}</span>`;
//   div.appendChild(p);

//   const fileLink = document.createElement('a');
//   fileLink.href = fileMessage.fileData;
//   fileLink.target = '_blank';
//   fileLink.textContent = 'File Download';

//   div.appendChild(fileLink);

//   chatMessages.appendChild(div);
//   // Scroll down to the latest message
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// Existing code...


////////////////////////////////////////////


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
