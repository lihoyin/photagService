const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const express = require('express');
const {check, param, validationResult} = require('express-validator');
const multer = require('multer')
const Photo = require('../models/Photo')
const path = require('path');
const {jwtAuthenticate} = require('../utils/jwtUtils')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const dataUri = new Datauri();

const storage = multer.memoryStorage();
const multerUploads = multer({storage}).single('photo');

create = (req, res) => {
    if (req.file) {
        const file = dataUri.format(path.extname(req.file.originalname).toString(), req.file.buffer).content;
        cloudinary.v2.uploader.upload(file).then(result => {
            Photo.create({
                url: result.url,
                width: result.width,
                height: result.height,
                createdBy: req.user
            }).then(photo => res.json(photo))
        })
    }
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
    .post('/', [jwtAuthenticate, multerUploads], create)
    .get('/', findAll)
    .get('/:id', [param('id').isMongoId()], findOne);

