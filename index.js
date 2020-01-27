var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use('/photo', require('./src/controllers/photoControllers'))

app.listen(3000, function () {
    console.log('Photag Service started!');
});
