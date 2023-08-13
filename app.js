const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes');
const PORT=3000;
const CONNECTION_STRING='mongodb://127.0.0.1:27017/SkyLift';

mongoose.connect(CONNECTION_STRING,{useNewUrlParser:true,useUnifiedTopology:true});
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client')));
app.use('/api',indexRouter);
app.set('socketio',io);


let connections = 0;
io.on('connection',socket=>{
    io.emit('chat message',`there are ${++connections} users connetcted`)
    socket.on('disconnect', () => {
      console.log('user disconnected');
      io.emit('chat message',`there are ${--connections} users connetcted`);
    });
    // socket.on('chat message', (msg) => {
    //     console.log('message fro user: '+msg);
    //     io.emit('chat message', `message from user: ${msg}`);
    //   });
})


httpServer.listen(PORT,()=>console.log('server online'));