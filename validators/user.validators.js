const oMessage = require('../message/message');
const oStatus = require('../message/status');

exports.fValidateUserInput = (oReq, oRes, fNext) => {
    const sName = oReq.body.name;
    const sPassword = oReq.body.password;
    const sEmail = oReq.body.email;
    const oEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!sName || !sPassword || !sEmail) {
        return oRes.status(oStatus.nBadRequest).json(oMessage.sMandatoryFields);
    }
    if (!oEmailRegex.test(sEmail)) {
        return oRes.status(oStatus.nBadRequest).json(oMessage.sEmailNotValid);
    }
    fNext();
    return;
};
