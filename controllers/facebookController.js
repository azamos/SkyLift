const facebookAdsApi = require('facebook-nodejs-business-sdk');

const facebookPublish = ()=> {
    const postMessage = `Testing interatcion with facebook API...`
    fetch(`https://graph.facebook.com/${process.env.FacebookPageId}/feed`,{
        method: "POST",
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            message: postMessage,
            access_token: process.env.FacebookToken
          })
      }).then(res=>res.json()).then(res=>console.log(res)).catch(err=>console.error(err));
}

module.exports = { facebookPublish};