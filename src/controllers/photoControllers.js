const express = require('express');
const {check, param, validationResult} = require('express-validator');
const Photo = require('../models/Photo')
const mongoose = require('mongoose');

create = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    Photo.create({
        url: req.body.url,
        width: req.body.width,
        height: req.body.height
    }).then(photo => res.json(photo))
}

findAll = (req, res) => {
    Photo.find().sort('-updatedAt')
        .then(photos => res.send(photos))
};

findOne = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const photo = await Photo.findById(req.params.id)
    if (photo) {
        return res.send(photo);
    } else {
        return res.status(404).send({
            message: 'Photo not found with id ' + req.params.id
        });
    }
};

module.exports = express.Router()
    .post('/', [
        check('url').isURL(),
        check('width').isInt(),
        check('height').isInt()
    ], create)
    .get('/', findAll)
    .get('/:id', [
        param('id').isMongoId()
    ], findOne);

