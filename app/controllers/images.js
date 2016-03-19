'use strict';

const fs = require('fs');
const fileType = require('file-type');
const controller = require('lib/wiring/controller');
const models = require('app/models');
const awsUpload = require('../../lib/aws-upload');
const authenticate = require('./concerns/authenticate');
const awsDelete = require('../../lib/aws-delete');

const Image = models.image;

const multer = require('multer'); //
const upload = multer({ storage: multer.memoryStorage() });

const index = (req, res, next) => {
  Image.find()
    .then(images => res.json({ images }))
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let filename = req.file.originalname;
  let tagsArray = req.body.image.tags.split(', ');
  console.log(req.body.image.folder);
  new Promise((resolve, reject) =>
    fs.readFile(filename, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  ).then((data) => {
    let file = { data };
    file.type = fileType(data) || {
      ext: 'bin',
      mime: 'application/octet-stream',
    };
    return file;
  }).then(awsUpload)
  .then((awsS3Response) => {
    return Image.create( { folder: req.body.image.folder, name: req.file.originalname, location: awsS3Response.Location, comment: req.body.image.comment, _owner: req.currentUser._id, tags: tagsArray } );
  }).then((image) => {
    console.log('Success!');
    console.log(image);
    return res.json( { image } );
  }).catch(err => next(err));
};

const show = (req, res, next) => {
  Image.findById(req.params.id)
    .then(image => image ? res.json({ image }) : next())
    .catch(err => next(err));
};

// const update = function(id, field, value) {
//   let modify = {};
//   modify[field] = value;
//   Image.findByIdAndUpdate(id, { $set: modify }, { new: true })
//     .then(function(image) {
//       console.log(image.toJSON());
//     }).catch(console.error)
//     .then(done);
// };


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
  .then((image) =>
    image.location
  ).then(awsDelete)
  .then((response) => {
    console.log('hmmm');
    console.log(response);
  }).catch(err => next(err));
};

// return Image.create( { name: req.file.originalname, location: awsS3Response.Location, comment: req.body.image.comment  } );
//
// then((image) =>
// .then((image) => {
//   image.remove();
//   res.json(true);
// })

module.exports = controller({
  index,
  create,
  show,
  update,
  destroy
}, { before: [
  { method: authenticate, except: ['index', 'show'], },
  { method: upload.single('image[file]'), only: ['create'] },
], });
