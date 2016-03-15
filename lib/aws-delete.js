'use strict';

const AWS = require('aws-sdk');

const awsDelete = (fileLocation) => {
  let path = 'https://apalmer0.s3.amazonaws.com/';
  let fileName = fileLocation.replace(path, '');
  let params = {  Bucket: 'apalmer0', Key: fileName };
  let s3 = new AWS.S3();

  return new Promise((resolve, reject) =>
      s3.deleteObject(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  );
};

module.exports = awsDelete;
