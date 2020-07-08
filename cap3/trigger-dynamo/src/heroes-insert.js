const uuid = require('uuid');
const Joi = require("@hapi/joi");
const decoratorValidator = require('./utils/decorator-validator');
const enumParams = require('./utils/enum-params');

class Handler {

  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc
    this.dynamodbTable = process.env.DYNAMODB_TABLE
  }

  static validator() {
    return Joi.object({
      nome: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(50).min(2).required()
    })
  }

  async insertItem(params) {
    return this.dynamoDbSvc.put(params).promise();
  }

  prepareData(data) {
    const params = {
      TableName: this.dynamodbTable,
      Item: {
        ...data,
        id: uuid.v1(),
        createAt: new Date().toISOString()

      }
    }

    return params;
  }

  handlerSuccess(data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }

    return response;
  }

  handlerError(data) {
    const response = {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: `Couldn't create item!`
    }

    return response;
  }

  async main(event) {
    try {
      const data = event.body;
      const dbParams = this.prepareData(data);
      await this.insertItem(dbParams);

      return this.handlerSuccess(data);

    } catch (error) {
      console.error('Deu ruim**', error.stack);
      return this.handlerError({ statusCode: 500 });

    }
  }
}

// Factory
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({ dynamoDbSvc: dynamoDB });

module.exports = decoratorValidator(handler.main.bind(handler), Handler.validator(), enumParams.ARG_TYPES.BODY)
