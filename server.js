const express = require('express');
const helper = require('./server/helper')
const pokemonApi = require('./server/pokemon.server')
const userApi = require('./server/user.server');
const updatesApi = require('./server/updates.server');
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser');
const { UpdatesSchema } = require('./server/db/updates.schema');

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/pokemon', pokemonApi);
app.use('/api/user', userApi);
app.use('/api/updates', updatesApi);

const MongoDBUrlStr = 'mongodb+srv://franzhou:webdev666@webdevproj.4g8jkzy.mongodb.net/?retryWrites=true&w=majority'
const MONGO_CONNECTION_STRING = MongoDBUrlStr;

// mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

// const Update = mongoose.model('Update', UpdatesSchema, 'updatesTable');

// // Drop the index
// Update.collection.dropIndex('username_1', function(err, result) {
//   if (err) {
//     console.log('Error in dropping index:', err);
//   } else {
//     console.log('Index dropped:', result);
//   }
// });

let frontend_dir = path.join(__dirname, 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});


app.listen(process.env.PORT || 3500, function() {
    console.log("Starting server now...")
})
