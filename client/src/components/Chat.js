import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from './InfoBar'
import Input from './Input'
import Messages from './Messages'
import '../styles/Chat.css'

// this.props.match.params.w/e
// this.props.history.push(`/users/${userKey}`)
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [users, setUsers] = useState([]);
  const ENDPOINT = 'localhost:5000'
  useEffect(() => {
    const {name, room} = queryString.parse(location.search) // gets name and room from url
    socket = io(ENDPOINT)
    console.log(location.search)
    setName(name)
    setRoom(room)
    console.log(name, name)
    console.log(socket)
    socket.emit('join', { name, room }, () => {

    })

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', (message => { // listening for messages
      setMessages([...messages, message])
    }), [messages]);
  })

  useEffect(() => {
    socket.on('roomData', (({ room, users }) => {
      setUsers([users])
    }), [users]);
  })

  const sendMessage = (event) => { // function for sending messages
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  console.log(message, messages)
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {/* <TextContainer users={users} /> */}
    </div>
  )
}

export default Chat;
