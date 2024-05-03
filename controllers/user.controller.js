const fs = require('fs').promises;
require('dotenv').config();

const bcrypt = require('bcrypt');
const nSaltRounds = 10;
const oStatus = require('../message/status');
const oMessage = require('../message/message');

const jwt = require('jsonwebtoken');
const sJwtSecret = process.env.JWT_SECRET;

async function fReadUsersData() {
    const sData = await fs.readFile('./users.json', 'utf8');
    return JSON.parse(sData);
}

async function fWriteUsersData(aData) {
    const sJsonData = JSON.stringify(aData, null, 2);
    await fs.writeFile('./users.json', sJsonData);
}

async function fHashPassword(sPassword) {
    return bcrypt.hash(sPassword, nSaltRounds);
}

exports.fCreateUser = async (oReq, oRes) => {
    try {
        const sName = oReq.body.name;
        const sEmail = oReq.body.email;
        const sPassword = oReq.body.password;
        const aUsers = await fReadUsersData();

        const bUserExists = aUsers.some(oUser => oUser.email === sEmail);
        if (bUserExists) {
            return oRes.status(oStatus.nConflict).json(oMessage.sUserExists);
        }

        const sHashedPassword = await fHashPassword(sPassword);
        const oNewUser = {
            id: aUsers.length + 1,
            name: sName,
            email: sEmail,
            password: sHashedPassword
        };

        aUsers.push(oNewUser);
        await fWriteUsersData(aUsers);
        oRes.status(oStatus.nCreated).json({
            id: oNewUser.id,
            name: oNewUser.name,
            email: oNewUser.email
        });
    } catch (error) {
        oRes.status(oStatus.nBadRequest).json({ error: error.message });
    }
};

exports.fGetUser = async (req, res) => {
    try {
        const nId = parseInt(req.params.id);
        const aUsers = await fReadUsersData();
        const oUser = aUsers.find(u => u.id === nId);
        if (oUser) {
            res.status(oStatus.nStatusSuccess).json(oUser);
        } else {
            res.status(oStatus.nNotFound).json(oMessage.sUserNotFound);
        }
    } catch (error) {
        res.status(oStatus.nInternalServerError).json(oMessage.sInternalServerError);
    }
};

exports.fUpdateUser = async (req, res) => {
    try {
        const nId = parseInt(req.params.id);
        const { email: sEmail, name: sName, password: sPassword } = req.body;
        const aUsers = await fReadUsersData();
        const nIndex = aUsers.findIndex(u => u.id === nId);

        if (nIndex === -1) {
            return res.status(oStatus.nNotFound).json(oMessage.sUserNotFound);
        }

        if (sEmail && aUsers.some(u => u.email === sEmail && u.id !== nId)) {
            throw new Error("Email already in use by another account");
        }

        if (sPassword) {
            const sHashedPassword = await fHashPassword(sPassword);
            aUsers[nIndex].password = sHashedPassword;
        }

        if (sName) aUsers[nIndex].name = sName;
        if (sEmail) aUsers[nIndex].email = sEmail;

        await fWriteUsersData(aUsers);
        res.status(oStatus.nStatusSuccess).json({ id: aUsers[nIndex].id, name: aUsers[nIndex].name, email: aUsers[nIndex].email });
    } catch (error) {
        res.status(oStatus.nBadRequest).json({ error: error.message });
    }
};

exports.fDeleteUser = async (req, res) => {
    try {
        const nId = parseInt(req.params.id);
        let aUsers = await fReadUsersData();
        const nIndex = aUsers.findIndex(u => u.id === nId);
        if (nIndex !== -1) {
            aUsers.splice(nIndex, 1);
            await fWriteUsersData(aUsers);
            res.status(oStatus.nNoContent).end();
        } else {
            res.status(oStatus.nNotFound).json(oMessage.sUserNotFound);
        }
    } catch (error) {
        res.status(oStatus.nInternalServerError).json(oMessage.sInternalServerError);
    }
};

// exports.fGetUsers = async (req, res) => {
//     try {
//         const nPage = parseInt(req.query.page) || 1;
//         const nLimit = parseInt(req.query.limit) || 10;
//         const sData = await fs.readFile('users.json', 'utf8');
//         const aUsers = JSON.parse(sData);

//         const nStartIndex = (nPage - 1) * nLimit;
//         const nEndIndex = nStartIndex + nLimit;

//         const aUsersPage = aUsers.slice(nStartIndex, nEndIndex);

//         const oResult = {
//             nextPage: nEndIndex < aUsers.length ? nPage + 1 : null,
//             prevPage: nPage > 1 ? nPage - 1 : null,
//             totalUsers: aUsers.length,
//             totalPages: Math.ceil(aUsers.length / nLimit),
//             data: aUsersPage
//         };

//         res.status(oStatus.nStatusSuccess).json(oResult);
//     } catch (error) {
//         console.error("Failed to get users:", error);
//         res.status(oStatus.nInternalServerError).json(oMessage.sInternalServerError);
//     }
// };

exports.fLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await fReadUsersData(); // Your function to get user data
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Assuming 'role' is a property of the user object
        const payload = {
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error", data: error.message });
    }
};
