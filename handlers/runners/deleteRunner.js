'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });



// Function to delete Runner user
//TODO: Add verification
exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });


    let responseBody = "";
    let statusCode = 0;

    const { email } = event.pathParameters;
    const params = {
        TableName: "Runners",
        Key: {
            
            email: email,
        }
    }


    try {
        const data = await documentClient.delete(params).promise();
        responseBody = JSON.stringify(data.Item);

        statusCode = 200;
    }
    catch (err) {
        responseBody = "Error";
        statusCode = 403;
        console.log(err)

    }


    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "Test"

        },
        body: responseBody
    }

    return response;
}
