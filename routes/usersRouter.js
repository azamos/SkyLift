const usersRouter = require('express').Router();
const {
    getUser,
    createUser
 } = require('../controllers/userController');

usersRouter.post('/checkuser',getUser);
usersRouter.post('/',createUser);
module.exports = usersRouter;