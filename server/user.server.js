const express = require('express');
const router = express.Router();

const UserAccessor = require('./db/user.model');

router.post('/signup', async function(request, response) {
    const body = request.body;
    const username = body.username;
    const password = body.password;
    console.log(password);
    if(!username || !password) {
        response.status(401);
        return response.send("Incomplete request")
    }

    try {
        // Check if user already exists
        const existingUser = await UserAccessor.getUserByUsername(username);
        if (existingUser) {
            return response.status(409).send("Username already taken"); 
        }
        const newUser = {
            username: username,
            password: password,
        }
        const createdUser = await UserAccessor.insertUser(newUser)
        response.cookie('username', createdUser.username)
        response.json(createdUser);

    } catch (error) {
        console.error("Error in signup:", error);
        response.status(500).send("Internal server error");
    }

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
        return response.send("Try another password!")
    }

})

router.post('/logout', async function(request, response) {
    response.clearCookie('username'); // this doesn't delete the cookie, but expires it immediately
    response.send();
});

router.get('/isLoggedIn', async function(request, response) {
    const username = request.cookies.username;

    if (!username) {
        // If there's no username in cookies, the user is not logged in
        return response.send({ isLoggedIn: false });
    }

    const existingUser = await UserAccessor.getUserByUsername(username);
    if (!existingUser) {
        return response.status(404).send("User not found");
    }
    response.send({
        isLoggedIn: true,
        username: username,
        joinedTime: existingUser.createdTime,
        bio: existingUser.bio
    });

});

router.get('/:username', async function(req, res) {
    const username = req.params.username;
  
    // if (!username) {
    //   return res.status(400).send("Username is required");
    // }
    const user = await UserAccessor.getUserByUsername(username);
    if (user) {
        return res.send({
            username: username,
            joinedTime: user.createdTime,
            bio: user.bio
        });
    } else {
        return res.status(404).send("User not found");
    }

});

router.put('/:username', async function(req, res) {
    const username = req.params.username;
    const updateBio = req.body.bio;
    try {
        await UserAccessor.updateUserBio(username, updateBio);
        res.status(200).send("Successfully update bio of " + username);
    } catch (error) {
        console.error("Error update:", error);
        res.status(500).send("Error update bio");
    }

});
  
module.exports = router;


// https://www.google.com/search?q=pokemon