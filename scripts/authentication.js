'use strict';

let globalVariables = require('./global-variables');
let pageSetup = require('./page-setup');

let signUp = function signUp(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  console.log('starting signup');
  $.ajax({
    url: globalVariables.myApp.baseUrl + '/sign-up',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log('signup success');
    console.log(data);
    console.log('there\'s your data!');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

let logIn = function logIn(event) {
  event.preventDefault();
  console.log('starting login.');
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.myApp.baseUrl + '/sign-in',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (user) {
    console.log('logged in');
    globalVariables.myApp.user = user;
    console.log(user);
    console.log('theres the user');
    pageSetup.toggleLoggedIn();
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// log out actions
let logOut = function logOut (event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  $.ajax({
    // why do i have to access these via myApp.user.user?
    url: globalVariables.myApp.baseUrl + '/sign-out/' + globalVariables.myApp.user.user._id,
    headers: {
      Authorization: 'Token token=' + globalVariables.myApp.user.user.token,
    },
    method: 'DELETE',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log(data);
    console.log('logged out');
    pageSetup.toggleLoggedOut();
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

module.exports = {
  signUp,
  logIn,
  logOut
};
