import socketIOClient from 'socket.io-client'

export const socket = socketIOClient('localhost:8080', { transport: ['websocket', 'polling', 'flashsocket'] });

export function connectSocket(user) {
  socket.on('connect', () => {
    socket.emit('connected', {socketId: socket.id, userEmail: user.email}); 
  });
}

socket.on('messageReceive', message => {
  // console.log('receiving messages', message)
  requestReceiveMessages({socketId: socket.id, userEmail: message.userEmail, friendEmail: message.friendEmail});
})
