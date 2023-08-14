const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes');
const PORT = 3000;
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/SkyLift';

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client')));
app.use('/api', indexRouter);
app.set('socketio', io);


let connections = 0;
let watchedFlights = new Map();
io.on('connection', socket => {
  connections++;
  //console.log('a user opened a sebsocket connection, there are now: ' + connections + ' open connections');
  io.emit('chat message', `User joined.there are ${connections} users connetcted`)
  socket.on('disconnect', () => {
    connections--;
    //console.log('user disconnected, there are currently only ' + connections + ' connections');
    io.emit('chat message', `User left.there are ${connections} users connetcted`);
  });
  socket.on('watched flights', payload => {
    //console.log(payload);
    const { featuredDeals, socketId } = payload;
    featuredDeals.forEach(deal => {
      if (watchedFlights.get(deal) == null) {
        //let clients_set = new Set();
        //clients_set.add(socketId);
        watchedFlights.set(deal, new Set());
      }
        watchedFlights.get(deal).add(socketId);
        //returns a client set _^
    });
    //console.log(watchedFlights)
  })
  socket.on('unsubscribe flights', payload => {
    console.log('before unsubing, the subbed flights are');
    console.log(watchedFlights);
    console.log('flights to unsub from:')
    console.log(payload);
    const { featuredDeals, socketId } = payload;
    featuredDeals.forEach(deal => {
      if (watchedFlights.get(deal) == null) {
        return;
      }
      watchedFlights.get(deal).delete(socketId);
    });
    console.log('watchedFlights list after unsubing:')
    //Now, to let know to all subscribers of this flight that there is 1 less client
    console.log(watchedFlights)
  })

  // socket.on('chat message', (msg) => {
  //     console.log('message fro user: '+msg);
  //     io.emit('chat message', `message from user: ${msg}`);
  //   });
})


httpServer.listen(PORT, () => console.log('server online'));