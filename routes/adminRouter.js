const adminRouter = require('express').Router();
const adminModel = require("../models/adminModel");

const {
    verifyEmail,
} = require('../controllers/adminController');




adminRouter.get('/',verifyEmail);
adminRouter.delete('email',)





module.exports=adminRouter; 
