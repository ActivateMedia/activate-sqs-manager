// Import the AWS SDK
const AWS = require('aws-sdk');
const _ = require('lodash');
const splitArray = require("split-array");
const uuid = require('uuid');

class Message {
  constructor(props){
    this.region = props.region;
    this.apiVersion = props.apiVersion;
    this.queueUrl = props.queueUrl;
    this.batchSize = props.batchSize;
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

  async sendMessageToQueue(message) {
    return new Promise((resolve, reject) => {
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
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async sendBatchMessagesToQueue (batch) {
    return new Promise((resolve, reject) => {
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
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async readMessageFromQueue () {
    return new Promise((resolve, reject) => {
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
          reject(err);
        } else if (!_.isEmpty(data.Messages)) {
          resolve(data);
        } else {
          resolve({});
        }
      });
    });
  }

  async deleteQueue () {
    return new Promise((resolve, reject) => {
      const params = {
        QueueUrl: this.queueUrl
      }
      this.sqs.deleteQueue(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  }

  async purgeQueue () {
    return new Promise((resolve, reject) => {
      const params = {
        QueueUrl: this.queueUrl
      }
      this.sqs.purgeQueue(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  }
}

module.exports = Message;