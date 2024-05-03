const fs = require('fs').promises;

async function fReadUsersData() {
    const sData = await fs.readFile('./users.json', 'utf8');
    return JSON.parse(sData);
}

exports.fGetUsersAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;  // Set default values for page and limit
        const aUsers = await fReadUsersData();

        const nStartIndex = (page - 1) * parseInt(limit);
        const nEndIndex = nStartIndex + parseInt(limit);

        const aUsersPage = aUsers.slice(nStartIndex, nEndIndex);

        res.json({
            nextPage: nEndIndex < aUsers.length ? parseInt(page) + 1 : null,
            prevPage: page > 1 ? parseInt(page) - 1 : null,
            totalUsers: aUsers.length,
            totalPages: Math.ceil(aUsers.length / parseInt(limit)),
            data: aUsersPage
        });
    } catch (error) {
        console.error("Failed to get users:", error);
        res.status(500).json({ error: 'Internal Server Error', data: error.message });
    }
};
