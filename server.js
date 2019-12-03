const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {

  // newUser has joined chat socket
  socket.on('newUser', (user) => {
    socket.broadcast.emit('newUser', user);
  });

  // user is writing socket
  socket.on('writing', (user) => {
    socket.broadcast.emit('writing', user);
  });
  socket.on('finishedWriting', (user) => {
    console.log('onchange is working');
    socket.broadcast.emit('finishedWriting', user);
  })

  // user has left the chat socket
  socket.on('close', (user) => {
    console.log('user is leaving... ', user);
    socket.broadcast.emit('close', user);
  });

  // user have sent a message socket
  socket.on('msg', (data) => {
    console.log('comment text: ', data.text, '; user: ', data.userName);
    socket.broadcast.emit('msg', data);
  })
});
