const formsRouter = require('express').Router();
const path = require('path');

formsRouter.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname, '../client/registerform.html'));
})
formsRouter.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, '../client/loginform.html'));
})

module.exports = formsRouter;