const bcrypt = require('bcrypt');

function generateRandomResponse() {
    return "hello " + Math.floor(Math.random() * 10);
}

async function hashPassword(password) {
    const saltRounds = 10; // the cost factor, higher is more secure but slower
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error(err);
    }
}

async function checkPassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match; // true if passwords match, false otherwise
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    generateRandomResponse,
    hashPassword,
    checkPassword
}

// exports.generateRandomResponse = generateRandomResponse