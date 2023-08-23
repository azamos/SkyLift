const usersRouter = require('express').Router();
const requireAuthorization = require('../middleware/authorization');
const {
    userLogin,
    createUser,
    getUserData,
    getUsersList,
    updateUser,
    deleteUser,
    signOut,
    checkUserPassword
 } = require('../controllers/userController');

//these 2 don't need authorization, since users who login/register do so since they
//need to have an authentication token created
usersRouter.post('/checkuser',userLogin);
usersRouter.post('/',createUser);
usersRouter.post('/checkpassword',requireAuthorization,checkUserPassword);
usersRouter.post('/getUserData',requireAuthorization,getUserData);
usersRouter.get('/usersList',requireAuthorization,getUsersList);
usersRouter.post('/update',requireAuthorization,updateUser);
usersRouter.post('/delete',requireAuthorization,deleteUser);
usersRouter.get('/signout',requireAuthorization,signOut);
module.exports = usersRouter;