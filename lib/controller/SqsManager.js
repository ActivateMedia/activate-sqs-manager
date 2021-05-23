const Consumer = require('./Consumer');
const Message = require('./Message');
const Validator = require('./Validator');

const types = ['consumer', 'message'];

class SqsManager extends Validator {
  constructor(props) {
    super(props);

    if (this.type === types[0]) {
      return new Consumer(this);
    } else if (this.type === types[1]) {
      return new Message(this);
    }
  }
}

module.exports = SqsManager;