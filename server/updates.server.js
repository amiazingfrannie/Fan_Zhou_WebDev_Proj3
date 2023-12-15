const express = require('express');
const router = express.Router();

const UpdatesAccessor = require('./db/updates.model');

//create post
router.post('/add', async function(request, response) {
    console.log(request.cookies)
    const name = request.cookies.username
    
    if(!name) {
        response.status(400)
        return response.send("Users need to be logged in to create a new post")
    }

    const body = request.body;
    console.log(body);
    const context = body.context;
    console.log(context);
    const username = name;

    if(!context) {
        response.status(400);
        return response.send("Missing post text")
    }

    const newUpdate = {
        username: username,
        context: context,
    }

    console.log(newUpdate);
    const createdUpdate = await UpdatesAccessor.insertUpdates(newUpdate)

    response.json(createdUpdate);

})

// /api/updates/all => return all users' updates 
router.get('/all', async function(req, response) {

    const allUpdates = await UpdatesAccessor.getAllUpdates()
    return response.json(allUpdates)

})

// /api/updates/allByUser => return all users' updates 
router.get('/:username', async function(req, res) {
    const username = req.params.username;
    console.log(username);

    if (!username) {
      return res.status(400).send("Username is required");
    }
    try {
      const foundUpdates = await UpdatesAccessor.findUpdatesByUsername(username);
      console.log(foundUpdates);
      res.json(foundUpdates);
    } catch (error) {
      console.error(error);
      res.status(500).send("Can't get data by username");
    }
  });

// router.delete('/:updateId', function(request, response) {
//     const updateIdToDelete = Number(request.params.updateId);
    
//     let indexToDelete = -1;
//     for(let i = 0; i < updatesDB.length; i++) {
//         const updateValue = updatesDB[i];
//         if(updateValue.id === updateIdToDelete) {
//             indexToDelete = i;
//         } 
//     }

//     if(indexToDelete !== -1) {
//         updatesDB.splice(indexToDelete, 1);
//     }

//     response.status(200);

//     return response.send("Successfully deleted " + updateIdToDelete)
// })

// router.put('/:updateId', function(request, response) {
//     const updatesIdToUpdate = Number(request.params.updatesId);
//     const username = request.cookies.username;
//     const context = request.body.context;
//     const modifiedTime = Date.now;
    
//     let updatesToUpdate = null
//     for(let i = 0; i < updatesDB.length; i++) {
//         const updatesValue = updatesDB[i];
//         if(updatesValue.id === updatesIdToUpdate) {
//             updatesToUpdate = updatesDB[i]
//         } 
//     }

//     if (updatesToUpdate && updatesToUpdate.username === username) {
//         updatesToUpdate.context = context;
//         updatesToUpdate.modifiedTime = modifiedTime;
//         response.status(200);
//         return response.send("Successfully update updates with ID " + updatesIdToUpdate)
//     } else {
//         response.status(404);
//         return response.send("Could find updates with ID " + updatesIdToUpdate)
//     }
    
// });

router.put('/:updateId', async function(request, response) {
    const updateIdToUpdate = request.params.updateId;
    const updatePost = request.body.context;
    try {
        console.log(updateIdToUpdate);
        console.log(updatePost);
        await UpdatesAccessor.updatePost(updateIdToUpdate, updatePost);
        response.status(200).json(updatePost);
    } catch (error) {
        console.error("Error update:", error);
        response.status(500).send("Error update");
    }
    
});

router.delete('/:deleteId', async function(request, response) {
    const updateToDelete = request.params.deleteId;
    
    try {
        await UpdatesAccessor.findUpdateByIdAndDelete(updateToDelete);
        response.status(200).send("Successfully deleted update with ID ");
    } catch (error) {
        console.error("Error deleting update:", error);
        response.status(500).send("Error deleting update");
    }
});

// to clean test data
router.delete('/', async function(request, response) {
    const updatesOfUserToDelete = request.body.username;
    
    try {
        await UpdatesAccessor.deleteByUsername(updatesOfUserToDelete);
        response.status(200).send("Successfully deleted all updates with username ");
    } catch (error) {
        console.error("Error deleting update:", error);
        response.status(500).send("Error deleting update");
    }
});

module.exports = router;

