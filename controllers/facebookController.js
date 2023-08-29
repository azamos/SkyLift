/*
IMPORTANT: generate API keys here: https://developers.facebook.com/tools/explorer/
make sure meta app is set to SkyLift Dev
after you have an api key, save it in /config/.env/local as FacebookToken
finally, go to https://developers.facebook.com/tools/debug/accesstoken/
enter your token here, and extend its duration, so we wont have to repeat this shitty process
 */

const facebookPublish = async (req, res) => {
    if(!(process.env.FacebookCopyOfExtendedToken && process.env.FacebookPageId)){
        console.error('missing configurations');
        res.send({error:'missing configurations'});
        return;
    }
    const { origin, company, destination, availableEcoSeats, price } = req.body;
    const postMessage = `New flight from ${origin} to ${destination}, with
    ${company}, for only ${price}$! Only ${availableEcoSeats} seats remain!`;
    fetch(`https://graph.facebook.com/${process.env.FacebookPageId}/feed`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: postMessage,
            access_token: process.env.FacebookCopyOfExtendedToken
        })
    }).then(result => result.json()).then(result => {
         res.send(result);
         return;
         })
        .catch(err => {
            console.error(err);
            res.send({error:'could not post to fb'});
            return;
        });
}

module.exports = { facebookPublish };