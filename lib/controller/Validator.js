// Define constant
DEFAULT_BATCH_SIZE = 10;
DEFAULT_API_VERSION = "2012-11-05";
DEFAULT_REGION = "eu-central-1";
POLLING_WAIT_TIME = 500;

class Validator {
  constructor(props, child) {
    if (!props.queueUrl && props.queueUrl === '') throw "Can't initialize SEConsumer, queue url is missing or empty!";
    if (child === 'SEConsumer') {
      if (!props.messageHandler && typeof messageHandler !== 'function') throw "Can't initialize SEConsumer, messageHandler is missing or not a function!";
    }

    this.queueUrl = props.queueUrl;
    this.messageHandler = props.messageHandler;
    this.batchSize = props.batchSize || DEFAULT_BATCH_SIZE;
    this.apiVersion = props.apiVersion || DEFAULT_API_VERSION;
    this.region = props.region || DEFAULT_REGION;
    this.pollingWaitTimeMs = props.pollingWaitTimeMs || POLLING_WAIT_TIME;
  }
}

module.exports = Validator;