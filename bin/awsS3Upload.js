'use strict';

require('dotenv').load();

const awsUpload = require('../lib/aws-upload');
const Image = require('../app/models/image.js');

let awsS3Upload = function(fileToUpload){
  return new Promise((resolve, reject) => {
    let result = awsUpload(fileToUpload);
    result ? resolve(result) : reject(result);
  }).then((awsS3Response) => {
    return Image.create({ location: awsS3Response.Location,
        name: fileToUpload.name,
        folder: fileToUpload.folder,
        comment: fileToUpload.comment,
        tags: fileToUpload.tags,
        _owner: fileToUpload._owner
      });
  }).then((file) => {
    console.log('Success!');
    console.log(file);
  }).catch(console.error);
};

module.exports = awsS3Upload;
