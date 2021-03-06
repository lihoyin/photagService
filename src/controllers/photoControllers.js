const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const express = require('express');
const {check, param, validationResult} = require('express-validator');
const multer = require('multer')
const Photo = require('../models/Photo')
const path = require('path');
const {jwtAuthenticate} = require('../utils/jwtUtils')
const ObjectId = require('mongodb').ObjectID;

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
    console.log('req', req.query.tag)
    const {tag} = req.query

    Photo.find(tag ? {'tags.name': {'$in': tag}} : {}).sort('-updatedAt')
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

addTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    Photo.updateOne({
        _id: req.params.id,
        'tags.name': {$nin: req.body.tag}
    }, {
        $addToSet: {
            tags: {
                name: req.body.tag,
                relativity: 0,
                reviewerCount: 0,
                createdBy: req.user
            }
        }
    }).then(result => {
        res.send(result)
    })
}

deleteTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    Photo.update(
        {_id: ObjectId(req.params.photoId)},
        {$pull: {tags: {_id: ObjectId(req.params.tagId), createdBy: req.user}}}
    ).then(result => {
        res.send(result)
    })
}

module.exports = express.Router()
    .post('/', [jwtAuthenticate, multerUploads], create)
    .get('/', findAll)
    .get('/:id', [param('id').isMongoId()], findOne)
    .post('/:id/tags', [jwtAuthenticate, param('id').isMongoId()], addTag)
    .delete(
        '/:photoId/tags/:tagId',
        [jwtAuthenticate, param('photoId').isMongoId(), param('tagId').isMongoId()],
        deleteTag
    );

