const express = require('express');
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

app.use('/api/user', userApi);
app.use('/api/updates', updatesApi);

const MongoDBUrlStr = 'mongodb+srv://franzhou:webdev666@webdevproj.4g8jkzy.mongodb.net/?retryWrites=true&w=majority'
// const MONGO_CONNECTION_STRING = MongoDBUrlStr;

const mongoDB = process.env.MONGODB_URL || MongoDBUrlStr;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

let frontend_dir = path.join(__dirname, 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});


app.listen(process.env.PORT || 3500, function() {
    console.log("Starting server now...")
})
