const express = require('express');
const app = express();
const http = require('http');
const routers = require('./routers');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('./managers/socket');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
routers(app);
global.__homedir = __dirname;

const server = http.createServer(app);
const PORT = 3000;
mongoose.connect('mongodb://localhost/beeweb-task', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(
    socket(server),
    server.listen(PORT)
);
