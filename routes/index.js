const router = require('express').Router();
const flightsRouter = require('./flightsRouter');
const usersRouter = require('./usersRouter');
const locationRouter = require('./locationRouter');
const requireAuthorization = require('../middleware/authorization');

router.get('/',requireAuthorization,(req,res)=>res.send({msg:'welcome. are you lost?'}));
router.get('/news',requireAuthorization,(req,res)=>{
    //fetch(`https://api.worldnewsapi.com/search-news?api-key=${process.env.News}`) - //less friendly. limited to max 50 req daily
    if(!process.env.News2){
        console.error('DEV: please create a FREE DEVELOPER user at https://newsapi.org, so you can load the news as well');
        res.send({error:'missing API key'});
        return;
    }
    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.News2}`)//newsai - developer friendly
    .then(result=>result.json())
    .then(result=>{
        res.json(result);
    })
    .catch(err=>{
        console.error(err);
        res.send({error:'failed to bring news for some reason. DEVELOPER, read in server terminal'});
        return;
    })
});
router.use('/flights',flightsRouter);
router.use('/users',usersRouter);
router.use('/locations',locationRouter);


module.exports = router;