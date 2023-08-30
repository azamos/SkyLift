const express = require('express');
const fs = require('fs');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes');
const locationModel = require('./models/locationModel');
//const {expireToken} = require('./services/tokenDbService');



const newLocal = require('custom-env')
newLocal.env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cookieParser());
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client')));
app.use('/api', indexRouter);
app.set('socketio', io);

(async () => {
  try {
    const locationsCounter = await locationModel.countDocuments();
    if (locationsCounter == 0) {
      const jsonFile = await fs.promises.readFile(path.join(__dirname, '/client/SkyLift.locations.json'), 'utf-8');
      const jsonToOBj = JSON.parse(jsonFile);
      await locationModel.insertMany(jsonToOBj);
      console.log('add locations data!');
    }
    else {
      console.log('data is already present...');
    }
  }
  catch (err) {
    console.log(err);
  }
})()
let connections = 0;
let watchedFlights = new Map();
io.on('connection', socket => {
  connections++;
  //console.log('a user opened a sebsocket connection, there are now: ' + connections + ' open connections');
  io.emit('chat message', `User joined.there are ${connections} users connetcted`)
  socket.on('disconnect', () => {
    connections--;
    //console.log('user disconnected, there are currently only ' + connections + ' connections');
    /* AMOS, TODO:  this is the place to call the method that invalidates tokens(expireToken or some such).
    You will also need to create the ws connection ONLY after signing in. Hmm. Is this the best way?
    Think about it more.*/
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
    // console.log('before unsubing, the subbed flights are');
    // console.log(watchedFlights);
    // console.log('flights to unsub from:')
    // console.log(payload);
    const { featuredDeals, socketId } = payload;
    featuredDeals.forEach(deal => {
      if (watchedFlights.get(deal) == null) {
        return;
      }
      watchedFlights.get(deal).delete(socketId);
    });
    // console.log('watchedFlights list after unsubing:')
    //Now, to let know to all subscribers of this flight that there is 1 less client
    // console.log(watchedFlights)
  })

  // socket.on('chat message', (msg) => {
  //     console.log('message fro user: '+msg);
  //     io.emit('chat message', `message from user: ${msg}`);
  //   });
})

httpServer.listen(process.env.PORT, () => console.log('server online on port ' + process.env.PORT));