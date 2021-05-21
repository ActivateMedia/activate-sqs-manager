// Loading gloal env file
require('dotenv').config({path: '.env'});

const Consumer = require('./lib/controller/Consumer');
const Message = require('./lib/controller/Message');

module.exports = {
  Consumer,
  Message
}