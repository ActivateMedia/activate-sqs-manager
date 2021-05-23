// Loading gloal env file
require('dotenv').config({path: '.env'});

const SqsManager = require('./lib/controller/SqsManager');

module.exports = {
  SqsManager
}