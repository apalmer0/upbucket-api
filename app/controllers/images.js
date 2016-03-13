'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Image = models.image;

const multer = require('multer'); //
const upload = multer({ storage: multer.memoryStorage() });

const index = (req, res, next) => {
  Image.find()
    .then(images => res.json({ images }))
    .catch(err => next(err));
};

const create = (req, res, next) => {
  // res.json( { body: req.body, file: req.file } );
  Image.create(req.body.image)
    .then(image => res.json({ image }))
    .catch(err => next(err));
};


module.exports = controller({
  index,
  create,
}, { before: [
  { method: upload.single('image[file]'), only: ['create'] },
], });
