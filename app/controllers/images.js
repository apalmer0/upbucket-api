'use strict';

// const fs = require('fs');
// const fileType = require('file-type');
const controller = require('lib/wiring/controller');
const models = require('app/models');
// const awsUpload = require('../../lib/aws-upload');
const awsS3Upload = require('../../lib/awsS3Upload');
const authenticate = require('./concerns/authenticate');
// const awsDelete = require('../../lib/aws-delete');

const Image = models.image;

const multer = require('multer'); //
const multerStorage = multer({ storage: multer.memoryStorage() });


const index = (req, res, next) => {
  let imageFilter = { _owner: req.currentUser };
  Image.find(imageFilter)
    .then(images => res.json({ images }))
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let file = Object.assign(req.file, {
    name: req.file.originalname,
    folder: req.body.image.folder,
    comment: req.body.image.comment,
    tagsArray: req.body.image.tags.split(', '),
    ownerName: req.currentUser.fullName,
    _owner: req.currentUser._id,
  });
  awsS3Upload(file)
    .then(file => res.json({ file }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Image.findById(req.params.id)
    .then(image => String(image._owner) === String(req.currentUser._id) ? image : next())
    .then(image => image ? res.json({ image }) : next())
    .catch(err => next(err));
};

const update = (req, res, next) => {
  console.log(req.body);
  Image.findById(req.params.id)
    .then(image => {
      if (!image) {
        return next();
      }
      console.log(image);
      return image.update(req.body)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  Image.findById(req.params.id)
  .then((image) => {
    image.remove();
    res.json(true);
  // // .then((image) =>
  // //   image.location
  // // ).then(awsDelete)
  // .then((response) => {
  //   console.log('hmmm');
  //   console.log(response);
  }).catch(err => next(err));
};

module.exports = controller({
  index,
  create,
  show,
  update,
  destroy
}, { before: [
  { method: authenticate },
  { method: multerStorage.single('image[file]'), only: ['create'] },
  { method: multerStorage.single('image'), only: ['update'] }
], });
