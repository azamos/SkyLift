const {emailSyntaxIsValid} = require('../services/utils');
const tokenDbService = require('../services/tokenDbService');
const is_authorized = async (key, email = null) => {
    let token_id = `${key}${process.env.SECRET}`;
    const token = await tokenDbService.getToken(token_id);
    if (!token || token.expired) {
        return false;
    }
    return email && token.user == email || token.authorization == 'admin';
}

const isAuthorized = async (token, email) => {
    const authorizedFlag = await is_authorized(token, email);
    return authorizedFlag;
};

const requireAuthorization = async (req, res, next) => {
    if (!(req.cookies && req.cookies.token)) {
        res.send({ error: 'Missing authorization' });
        return;
    }
    let authorizedFlag;
    if (req.body && req.body.email) {
        if(!emailSyntaxIsValid(req.body.email)){
            //422 error means UNPROCESSABLE ENTITY
            res.send({error:'wrong email format'});
            return;
        }
        authorizedFlag = await isAuthorized(req.cookies.token,req.body.email);
    }
    else {
        authorizedFlag = await isAuthorized(req.cookies.token);
    }


    if (!authorizedFlag) {
        res.send({ error: 'Unauthorized request' });
        return;
    }
    next();
};

module.exports = requireAuthorization;
