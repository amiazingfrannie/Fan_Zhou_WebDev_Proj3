const express = require('express');
const helper = require('./server/helper')
const pokemonApi = require('./server/pokemon.server')
const userApi = require('./server/user.server');
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser')


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/pokemon', pokemonApi);
app.use('/api/user', userApi);

// app.get('/', function(request, response) {
//     response.send(helper.generateRandomResponse())
// })

// app.get('/', function(request, response) {
//     response.send("This is the second app GET request");
// })

// app.post('/', function(requst, response) {
//     response.send("This is a POST request")
// })


const MONGO_CONNECTION_STRING = 'UPDATE MONGODB CONNECTION STRING HERE'

mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
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

//const http = require('http');

// const server = http.createServer(function (request, response) {
//     response.writeHead(200, { 'Content-Type': 'text/plain' })

//     response.end("Hello, my name is Hunter")


// })

// server.listen(3500, "127.0.0.1", function() {
//     console.log('Starting...')
// })