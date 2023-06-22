const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes');
const PORT=3000;
const CONNECTION_STRING='mongodb://127.0.0.1:27017/SkyLift';

mongoose.connect(CONNECTION_STRING,{useNewUrlParser:true,useUnifiedTopology:true});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client')));
app.use('/api',indexRouter);

app.listen(PORT,()=>console.log('server online'));