// server.js
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { ExpressPeerServer } = require('peer')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const peerServer = ExpressPeerServer(server, {
  debug: true
})

app.use('/peerjs', peerServer)
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`)
})

app.get('/:roomId', (req, res) => {
  res.render('screen', { roomId: req.params.roomId })
})

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)
