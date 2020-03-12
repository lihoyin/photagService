require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use('/photos', require('./src/controllers/photoControllers'))
app.use('/auth', require('./src/controllers/authController'))

app.listen(3000, function () {
    console.log('Photag Service started!');
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/photag', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
