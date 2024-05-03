const oStatus = require('../message/status');
const oMessage = require('../message/message');
const jwt = require('jsonwebtoken');

exports.fLogRequest = (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
};

exports.fHandleErrors = (err, req, res, next) => {
    console.error(err);
    res.status(oStatus.nInternalServerError).json(oMessage.sInternalServerError);
};

exports.fAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(oStatus.nUnauthorized);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(oStatus.nForbidden);
        req.user = user;
        next();
    });
};

exports.fCheckAdminRole = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(oStatus.nForbidden).json(oMessage.sForbiddenAccess);
    }
    next();
};
