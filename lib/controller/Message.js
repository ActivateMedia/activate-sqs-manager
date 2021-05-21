// Import the AWS SDK
const AWS = require('aws-sdk');
const _ = require('lodash');
const splitArray = require("split-array");
const uuid = require('uuid');

const Validator = require('./Validator');

class Message extends Validator {
  constructor(props){
    super(props);

    // configure AWSMessage
    this.configureAWSMessage();
  }

  configureAWSMessage() {
    const SESConfig = {
      apiVersion: this.apiVersion,
      region: this.region
    }
    AWS.config.update(SESConfig);

    // Create an SQS service object
    this.sqs = new AWS.SQS();
  }

  sendMessageToQueue(message) {
    console.log('sending message to queue');
    message.data.attempt = 0;
    message.attributes["attempt"] = {
      DataType: "Number",
      StringValue: '0'
    };

    let sqsOrderData = {
      MessageAttributes: message.attributes,
      MessageBody: JSON.stringify(message.data),
      QueueUrl: this.queueUrl
    };

    // Send the order data to the SQS queue
    let sendSqsMessage = this.sqs.sendMessage(sqsOrderData).promise();

    sendSqsMessage.then((data) => {
      console.log(`sendMessageToQueue | SUCCESS: ${data.MessageId}`);
      return "Message pushed to queue successfully";
    }).catch((err) => {
      console.log(`sendMessageToQueue | ERROR: ${err}`);
      return "We ran into an error. Please try again.";
    });
  }

  sendBatchMessagesToQueue (batch) {
    const spilttedMessage = splitArray(batch, this.batchSize);
    for (const messages of spilttedMessage) {
      var params = {
        QueueUrl: this.queueUrl,
        Entries: []
      };
      for (const message of messages) {
        params.Entries.push({
          Id: uuid.v4(),
          MessageBody: JSON.stringify(message)
        });
      }
      var sendSqsMessage = this.sqs.sendMessageBatch(params).promise();
    }
    sendSqsMessage.then((data) => {
      console.log(`sendBatchMessagesToQueue | SUCCESS: `, data);
      return "Batch messages pushed to queue successfully";
    }).catch((err) => {
      console.log(`sendBatchMessagesToQueue | ERROR: ${err}`);
      return "We ran into an error. Please try again.";
    });
  }

  readMessageFromQueue() {
    console.log('receiving messages from queue');
    const params = {
      AttributeNames: [],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        "All"
      ],
      QueueUrl: this.queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };
    this.sqs.receiveMessage(params, function(err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (!_.isEmpty(data.Messages)) {
        return data.Messages
      } else {
        return 'No data found';
      }
    });
  }
}

module.exports = Message;