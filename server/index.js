const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const app = express(); // makes the app
const server = http.createServer(app); // creates a server
const io = socketio(server); // creates the i/o for the socket

io.on('connection', (socket) => { // When a socket(client) connects
  console.log('We have a new connection');

  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id : socket.id, name, room }); // creates the user

    if(error) return callback(error); // callback error if username already exists
    socket.emit('message', { user: 'admin', text: `${user.name} welcome to the room ${user.room}` }) // sends message to the user logged in
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` }) // sends message to the whole chatroom
    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room , user: getUsersInRoom(user.room) })

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });
  socket.on('disconnect', () => { // calls when socket disconnects
    const user = removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` })
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  });
})

app.use(router);
server.listen(PORT, () => console.log(`Server has started on ${PORT}`));