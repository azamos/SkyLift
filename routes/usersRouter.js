const usersRouter = require('express').Router();
const {
    userLogin,
    createUser,
    getUserData,
    getUsersList
 } = require('../controllers/userController');

usersRouter.post('/checkuser',userLogin);
usersRouter.post('/getUserData',getUserData);
usersRouter.post('/',createUser);
usersRouter.get('/usersList',getUsersList);
module.exports = usersRouter;