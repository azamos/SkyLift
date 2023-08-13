const router = require('express').Router();
const flightsRouter = require('./flightsRouter');
const usersRouter = require('./usersRouter');
const locationRouter = require('./locationRouter');

router.get('/',(req,res)=>res.send("reached api router"));
router.use('/flights',flightsRouter);
router.use('/users',usersRouter);
router.use('/locations',locationRouter);


module.exports = router;