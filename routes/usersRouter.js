const usersRouter = require('express').Router();
const {
    userLogin,
    createUser,
    getUserData
 } = require('../controllers/userController');

usersRouter.post('/checkuser',userLogin);
usersRouter.post('/getUserData',getUserData);
usersRouter.post('/',createUser);
usersRouter.get('/searchUser/:email',getUserData);
module.exports = usersRouter;