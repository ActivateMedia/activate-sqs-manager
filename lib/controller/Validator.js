// Define constant
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_API_VERSION = "2012-11-05";
const DEFAULT_REGION = "eu-central-1";
const POLLING_WAIT_TIME = 500;

const types = ['consumer', 'message'];

class Validator {
  constructor(props) {
    if (!props.queueUrl && props.queueUrl === '') throw "Can't initialize sqs-manager, queue url is missing or empty!";
    if (!props.type) {
      throw "Can't initialize sqs-manager, type is missing or empty!";
    } else if (types.indexOf(props.type) === -1) {
      throw "Can't initialize sqs-manager, type can be one of [consumer, message]!";
    } else if (props.type === 'consumer') {
      if (!props.messageHandler && typeof messageHandler !== 'function') throw "Can't initialize sqs-manager, messageHandler is missing or not a function!";
    }

    this.queueUrl = props.queueUrl;
    this.type = props.type;
    this.messageHandler = props.messageHandler;
    this.batchSize = props.batchSize || DEFAULT_BATCH_SIZE;
    this.apiVersion = props.apiVersion || DEFAULT_API_VERSION;
    this.region = props.region || DEFAULT_REGION;
    this.pollingWaitTimeMs = props.pollingWaitTimeMs || POLLING_WAIT_TIME;
  }
}

module.exports = Validator;