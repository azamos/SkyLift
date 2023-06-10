const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, './client')));
app.get('/',(req,res)=>res.send("Making sure express installed went well. Nodemon is working also."));

app.listen(PORT,()=>console.log(`Listening on port: ${PORT}`));