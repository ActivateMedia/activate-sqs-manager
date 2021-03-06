# activate-sqs-manager
**activate-sqs-manager** is built on top of AWS-sdk to manage internal home production stuff.

## Version 1.x.x Now Available
The version 3.x of the AWS SDK for JavaScript is generally available. For more information see the [API Reference](https://github.com/galgoketan/Activate-AWS-sdk/tree/develop).

- **Prerequisite**

  This package rely on aws-sdk so you need to install [aws-sdk](https://www.npmjs.com/package/aws-sdk)
  and you also need to setup [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html)
  that will help to setup ~/.aws/ profile that aws-sdk read while configuring message and consumer agent.

## Table of Contents:
* [Installing](#Installing)
* [Configuring](#Configuring)
* [Uses](#Uses)

- **Installing**
Using npm:

```js
$ npm install git@github.com:ActivateMedia/activate-sqs-manager.git
```

## Configuring

- **configuring sqs consumer**

```js
const {SqsManager} = require('activate-sqs-manager');

// initializing sqs-consumer
new SqsManager({
  queueUrl: 'queue_url',
  type: 'consumer',
  messageHandler: function () {
    // attaching callback to listen messages from queue
  }
});
```


- **configuring sqs message**

```js
const {SqsManager} = require('activate-sqs-manager');

const message = new SqsManager({
  queueUrl: 'https://region.amazonaws.com/key/queuename',
  type: 'message'
});
```

- **Uses**

```js
// Derived data to push

const data = {
  "email":"abc.xyz.com",
  "item": "item_name",
  "itemPrice":"item_price",
  "itemQty":"item_qty"
};

// Defining attributes

const message = {
  attributes: {
    "email": {
      DataType: "String",
      StringValue: data.email
    },
    "item": {
      DataType: "String",
      StringValue: data.item
    },
    "itemPrice": {
      DataType: "String",
      StringValue: data.itemPrice
    },
    "itemQty": {
      DataType: "String",
      StringValue: data.itemQty
    }
  },
  data: data
}

// pushing it to queue

const message = new SqsManager({
  queueUrl: 'https://region.amazonaws.com/key/queuename',
  type: 'message'
});
message.sendMessageToQueue(message);

// Pusing batch messages to queue

const batch = [
  {
    "email":"abc.xyz.com",
    "item": "item_name",
    "itemPrice":"item_price",
    "itemQty":"item_qty"
  },
  {
    "email":"abc.xyz.com",
    "item": "item_name",
    "itemPrice":"item_price",
    "itemQty":"item_qty"
  },
  {
    "email":"abc.xyz.com",
    "item": "item_name",
    "itemPrice":"item_price",
    "itemQty":"item_qty"
  }
];
message.sendBatchMessagesToQueue(batch);

```

- **Default configurations**

There are some default constant that you can pass at the configuration time to override default values.

- DEFAULT_BATCH_SIZE = 10;
  The default batch size is 10 and it can't be greater then 10.

- DEFAULT_API_VERSION = "2012-11-05";
  The default api version is "2012-11-05" and you can use any api version mentioned [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html)

- DEFAULT_REGION = "eu-central-1";
  The default region is "eu-central-1" and you can define region listed [here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/java-dg-region-selection.html)

- POLLING_WAIT_TIME = 500;
  The duration (in milliseconds) to wait before repolling the queue and default is 500ms.

  you can pass the above constant to consumer at the configuration time as below:

```js
// initializing sqs-consumer
new SqsManager({
  queueUrl: 'https://region.amazonaws.com/key/queuename',
  batchSize: 2,
  pollingWaitTimeMs: 1000,
  apiVersion: '2011-12-05',
  region: 'us-west-1',
  messageHandler: function () {
    // attaching callback to listen messages from queue
  }
});
```

## Methods

**Message queue** methods
| Method | Result | Description |
| ------ | ------ | ------ |
| sendMessageToQueue | String | This method is used to insert single message to queue
| sendBatchMessagesToQueue | String | This method is used to insert batch messages to queue
| readMessageFromQueue | Object, String | This method is used to read messages from queue


## Queue Properties

**All the properties are String.**
| Property | Status | Message | Consumer |Descripiton |
| ------ | ------ | ------| ------| ------ |
| queueUrl | required | &#9745; | &#9745; | queue url |
| type | required | &#9745; | &#9745; |this indicates which type of queue instance you want to generate |
| messageHandler | required | &#9744; | &#9745; | A callback that listen messages from consumer queue |
| batchSize | required | &#9744; | &#9744; | The number of messages you want to push and retrieve to message and consumer respectively, This can't be greater than  10. |
| region | required | &#9744; | &#9744; | aws queue region |
| apiVersion | required | &#9744; | &#9744; | The api version you want to use |
|  pollingWaitTimeMs | required | &#9744; | &#9744; | The duration (in milliseconds) to wait before repolling the queue and default is 500ms. |