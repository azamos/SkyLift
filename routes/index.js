const router = require('express').Router();
const flightsRouter = require('./flightsRouter');

router.get('/',(req,res)=>res.send("reached api router"));
router.use('/flights',flightsRouter);

module.exports = router;