// var express = require('express');
// var app = express();
// app.use(express.static('public'))
// var server = require('http').Server(app);
// var io  = require('socket.io')(server);
// server.listen(3000,()=>console.log('server started !'));

// io.on('connect',function(socket){
//     console.log('ket noi',socket.id);
    
// });

// io.on("new message",function(data) {
//     console.log(data);
//   })

// const server = require('http').createServer()
// const io = require('socket.io')(server)

// io.on('connection', function (client) {
//   client.on('register', handleRegister)

//   client.on('join', handleJoin)

//   client.on('leave', handleLeave)

//   client.on('message', handleMessage)

//   client.on('chatrooms', handleGetChatrooms)

//   client.on('availableUsers', handleGetAvailableUsers)

//   client.on('disconnect', function () {
//     console.log('client disconnect...', client.id)
//     handleDisconnect()
//   })

//   client.on('error', function (err) {
//     console.log('received error from client:', client.id)
//     console.log(err)
//   })
// })

// server.listen(3000, function (err) {
//   if (err) throw err
//   console.log('listening on port 3000')
// })



const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

// var con  = require('./config');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

arrClients = [];
var i = 0;

wss.on('connection', function connection(ws,req) {
  // wss.clients[i] = ws;
  // i++;
  console.log('Sec-WebSocket-Key : ' + req.rawHeaders[7]);
  
  // console.log(ws._socket._handle.fd);
  
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      // var obj = JSON.parse(data);
      // t = '';
      // const arr = Object.keys(obj).map(key => {
      //     t = obj[key][0].name;
      // })
      
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
        
      }
    });

  });

});




server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

