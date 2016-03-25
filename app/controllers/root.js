'use strict';

const controller = require('lib/wiring/controller');

/* GET home page. */
const root = (req, res) => {
  res.json({ index: { title: 'upBucket' } });
};

module.exports = controller({
  root,
});
