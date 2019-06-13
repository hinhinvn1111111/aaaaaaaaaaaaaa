const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

var con  = require('./config');



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws,req) {

  console.log('Sec-WebSocket-Key : ' + req.rawHeaders[7]);
  
//   con.connect(function(err) {
//     // if (err) throw err;
//     console.log("Connected!");
//     con.query("SELECT * FROM login", function (err, result, fields) {
//       if (err) throw err;
//       // console.log(result);
//       result.forEach(item => {
//           console.log(item.Ten);
//       });
//     });
//   });


  ws.on('message', function incoming(data) {
    console.log(data);


    var obj = JSON.parse(data);
    var t = '';
    var createdAt='';
    var content='';
    const arr = Object.keys(obj).map(key => {
        t = obj[key][0].user._idSR.split(",");
        createdAt=obj[key][0].createdAt;
        content=obj[key][0].text;
    })
    console.log(t[0]+'--'+ t[1]+'--'+createdAt+'--'+content);
    
    con.connect(function(err) {
      // if (err) throw err;
      console.log("Connected!");
      //Insert a record in the "customers" table:
      var sql = "INSERT INTO message(ID1,ID2,Content,createdAt) VALUES('"+t[0]+"','"+t[1]+"','"+content+"','"+createdAt+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
    
  //     con.connect(function(err) {
  //   // if (err) throw err;
  //   console.log("Connected!");
  //   con.query("INSERT INTO message(ID1,ID2,Content,createdAt) VALUES('1','1002','a','')", function (err, result, fields) {
  //     // if (err) throw err;
  //     // console.log(result);
  //     result.forEach(item => {
  //         console.log(item.Ten);
  //     });
  //   });
  // });
      
    wss.clients.forEach(function each(client) {
      // var obj = JSON.parse(data);
      // t = '';
      // const arr = Object.keys(obj).map(key => {
      //     t = obj[key][0].name;
      // })
      
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // console.log(data);
        client.send(data);
        
      }
    });

  });

});




server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

