const express = require('express');
const router = express.Router();

const UserAccessor = require('./db/user.model');

router.post('/', async function(request, response) {
    const body = request.body;
    const username = body.username;
    const password = body.password;
    if(!username || !password) {
        response.status(401);
        return response.send("Incomplete request")
    }

    const newUser = {
        username: username,
        password: password,
    }

    const createdUser = await UserAccessor.insertUser(newUser)

    response.cookie('username', receivedUser.username)

    response.json("Successfully created new user " + createdUser.username);
})

router.post('/login', async function(request, response) {
    const body = request.body;
    const username = body.username;
    const password = body.password;
    if(!username || !password) {
        response.status(401);
        return response.send("Incomplete request")
    }

    const receivedUser = await UserAccessor.getUserByUsername(username)

    if(!receivedUser) {
        response.status(404);
        return response.send("No user with username " + username)
    }

    const isValidPassword = password === receivedUser.password;

    if(isValidPassword) {
        response.cookie('username', receivedUser.username)

        response.status(200);
        return response.send({loggedIn: true})
    } else {
        response.status(404);
        return response.send("No user with username + password combo exists " + username)
    }

})

router.post('/logout', async function(request, response) {
    response.clearCookie('username'); // this doesn't delete the cookie, but expires it immediately
    response.send();
});

router.get('/isLoggedIn', function(request, response) {
    const username = request.cookies.username;
    
    response.send({
        isLoggedIn: !!username,
        username: username
    });
})


module.exports = router;


// https://www.google.com/search?q=pokemon