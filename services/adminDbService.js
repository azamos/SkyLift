const adminRouter = require('express').Router();
const adminModel = require("../models/adminModel");

const verifyEmail = async(req,res)=> {
const{email} = req.params;
const result = await adminModel.find({email})
}

const createAdmin = async data => {
    const {email,password,canAddflight} = data;
    const newAdmin = new Admin({email,password,canAddflight});
    return await newAdmin.save();
}

const deleteAdmin = async 




module.exports = {
    verifyEmail,//Check the email
    createAdmin,
    deleteAdmin,
};