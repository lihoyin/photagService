const express = require('express');
const Photo = require('../models/Photo')
const mongoose = require('mongoose');

create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty"
        });
    }

    new Photo({
        url: req.body.url,
        width: req.body.width,
        height: req.body.height
    }).save().then(
        data => {
            res.send(data);
        }
    ).catch(
        err => {
            res.status(500).send({message: err.message});
        }
    );
}

findAll = (req, res) => {
    Photo.find().sort('-updatedAt')
        .then(
            photos => {
                res.send(photos);
            }
        ).catch(
        err => {
            res.status(500).send({
                    message: err.message
                }
            );
        });
};

findOne = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send({
            message: "Photo not found with id " + req.params.id
        });
    }

    const photo = await Photo.findById(req.params.id)
    if (photo) {
        return res.send(photo);
    } else {
        return res.status(404).send({
            message: "Photo not found with id " + req.params.id
        });
    }
};

module.exports = express.Router()
    .post('/', create)
    .get('/', findAll)
    .get('/:id', findOne);

