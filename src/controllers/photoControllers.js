const express = require('express');

create = (req, res) => {
    res.send({ message: "create photo success" });
}

findAll = (req, res) => {
    res.send({ message: "retrieve photos success" });
};

findOne = async (req, res) => {
    res.send({ message: `retrieve photo ${req.params.photoId} success` });
};

module.exports = express.Router()
    .post('/', create)
    .get('/', findAll)
    .get('/:photoId', findOne);

