'use strict';

require('dotenv').load();
const fs = require('fs');
const fileType = require('file-type');
const mongoose = require('../app/middleware/mongoose.js'); // this is the necessary db stuff
const awsUpload = require('../lib/aws-upload');
const Image = require('../app/models/images.js');

let filename = process.argv[2];
let comment = process.argv[3] || '';

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
.then((awsS3Response) =>
  Image.create( { location: awsS3Response.Location, comment: comment } ) // now we're saving to aws AND the db.
  // for some reason AWS returns the object with a capital Location. so we need to deal with that. 
).then((image) => { // image is the model that was created/saved.
  console.log('Success!');
  console.log(image);
}).catch(console.error) // catch ALSO returns a promise.
.then(() => mongoose.connection.close()); // will ALWAYS run last. whether or not there's an error, close the connection.
