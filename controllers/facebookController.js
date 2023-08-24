const facebookAdsApi = require('facebook-nodejs-business-sdk');

const facebook = async (req, res) => {
    const accessToken = process.env.FacebookToken;

    const api = facebookAdsApi.init(accessToken);

    const postData = {
        message: 'This is a test post',
    };

    await api.post('/me/feed', postData, (err, response) => {
        if (err) {
            console.error(`BIG YIKES: ${err}`);
            console.log(err);
        } else {
            console.log('yummi tummi');
            console.log(response);
        }
    });
    res.end();
}

module.exports = { facebook};