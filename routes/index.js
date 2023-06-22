const router = require('express').Router();
const flightsRouter = require('./flightsRouter');
const usersRouter = require('./usersRouter');

router.get('/',(req,res)=>res.send("reached api router"));
router.use('/flights',flightsRouter);
router.use('/users',usersRouter);

module.exports = router;