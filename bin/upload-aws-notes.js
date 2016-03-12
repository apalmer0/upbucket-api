'use strict';

require('dotenv').load();

const fs = require('fs'); // fs is built in! node gives it to us.
const fileType = require('file-type');
const AWS = require('aws-sdk');
const crypto = require('crypto');

let filename = process.argv[2];

const randomString = () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(16, (err, data) =>
      err ? reject(err) : resolve(data.toString('hex')) // data is actually random bytes, which could
      // (probably does) include those crazy characters. this will clean it up to only use hex characters.
    )
  );

// let comment = process.argv[3] || ''; // if there is no comment, it'll return empty string.
                                     // you can still call methods on empty strings.

// new Promise() returns a promise, so you can call .then() on it rather than a semicolon.
// no need to save as a variable if i'm just going to use & discard it.
// argument to a promise is a function that takes 2 arguments
// what is the type of resolve and reject? functions.
// what am i required to do with resolve and reject?
// if (err) {
//   throw err; // an error isn't being handled here, it's being passed to the next thing... which is node,
//   // which means it'll be handled in the stack trace, which isn't super helpful, but it'll at
//   // least break
// }
new Promise((resolve, reject) =>
  fs.readFile(filename, (err, data) =>
    // the ONE requirement a promise has is that you have to tell it how to deal with
    // resolve and reject.
    err ? reject(err) : resolve(data)
    // if (err) {
    //   return reject(err);
    // }
    //
    // resolve(data);
  )
).then((data) => { // then returns a promise. if resolved, it goes to the next then(). otherwise it skips to catch.
  // you can only pass a single item between .then() statements, so pass the file object that contains the type key
  // this will hold a lot of data so you can pass it ALL forward
  let file = { data }; // file is now a variable that contains a hash of data
  file.type = fileType(data) || { ext: 'bin', mime: 'application/octet-stream'}; // make a key called 'type' and store the filetype in there.
  // if there is no filetype, use a default value.
  return file;
  // if (data instanceof Buffer) { // (thing instanceof type) - if data is an instance of Buffer, then return true.
  //   console.log('It\'s a buffer');
  // }
  // console.log(`filename: ${filename}; comment: ${comment}; data: ${data}`);
  // // does the data in this function know anything about the 'data' on line 20?
  // // it's the same object in memory being referenced, but the name is arbitrary.
}).then((file) =>  {// then will take any function that takes a single argument and returns a single argument
  let dir = new Date().toISOString().split('T')[0];
  let s3 = new AWS.S3();

  return randomString().then((randomHexString) => ({
      ACL: 'public-read',
      Body: file.data,
      Bucket: 'apalmer0',
      ContentType: file.type.mime,
      // Key: `directory/file.${file.type.ext}`, // the name of the file being saved... looks like a path. aws turns this into  new dir with a file
      Key: `${dir}/${randomHexString}.${file.type.ext}`, // the name of the file being saved... looks like a path. aws turns this into  new dir with a file
      // we want to change the filename to use that randombytes string, but we cant just call it bc it's a promise, not a funciton. how?
  })).then((params) =>
    new Promise((resolve, reject) =>
      s3.upload(params, (err, data) =>  // w/o a promise, this callback just gets added to teh event cue. doesn't mean that it finished.
      err ? reject(err) : resolve(data)
      // console.log(err, data);
      // if (err) {
      //   throw err; // get a hard error if it fails. so far we haven't specified credentils, so this should run.
      // }
      // return file;  // even if they're the same. now we're testing to see if the other stuff we did changes this at all.
      )
    )
  // since all we're returning is file, it's not waiting for the callback to finish... that means that the rest
  // would run, regardless of whether or not the callback completed successfully. we need to return promise.
  );
}).then((awsS3) => {
  console.log('success');
  console.log(awsS3);
    // }).then((file) => {
    //   // what object is of type 'buffer'? data. data is a buffer.
    //   // so within file, how do i access the buffer? data is a buffer. data = buffer.
    //   console.log(`buffer length: ${file.data.length}`);
    //   console.log(`extension: ${file.type.ext}`);
    //   console.log(`content-type: ${file.type.mime}`); // whether this is .jpg or .png, the mime will start with image/
}).catch(console.error); // only one argument is ever passed forward by a promise.
