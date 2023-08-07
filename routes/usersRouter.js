const usersRouter = require('express').Router();
const {
    getUser,
    createUser,
    searchUser,
 } = require('../controllers/userController');

usersRouter.post('/checkuser',getUser);
usersRouter.post('/',createUser);
usersRouter.get('/searchUser/:email',searchUser);
module.exports = usersRouter;