// Import the AWS SDK
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');

class SEConsumer {
  constructor(props) {
    this.region = props.region;
    this.apiVersion = props.apiVersion;
    this.queueUrl = props.queueUrl;
    this.batchSize = props.batchSize;
    this.pollingWaitTimeMs = props.pollingWaitTimeMs;
    this.messageHandler = props.messageHandler;
    // configure AWSConsumer
    this.configureAWSConsumer();
    // initialising AWSConsumer
    this.initializeAWSConsumer();
  }

  configureAWSConsumer() {
    const SESConfig = {
      apiVersion: this.apiVersion,
      region: this.region
    }
    AWS.config.update(SESConfig);
  }

  initializeAWSConsumer() {
    const app = Consumer.create({
      queueUrl: this.queueUrl,
      batchSize: this.batchSize,
      pollingWaitTimeMs: this.pollingWaitTimeMs,
      handleMessageBatch: this.messageHandler,
      sqs: new AWS.SQS()
    });

    app.on('error', (err) => {
      console.error('SEConsumer | ERROR', err);
    });

    app.on('processing_error', (err) => {
      console.error('SEConsumer | PROCESSING_ERROR', err.message);
    });

    console.log('SQS listener is attached!');
    app.start();
  }
}

module.exports = SEConsumer;