function generateRandomResponse() {
    return "hello " + Math.floor(Math.random() * 10);
}

module.exports = {
    generateRandomResponse
}

// exports.generateRandomResponse = generateRandomResponse