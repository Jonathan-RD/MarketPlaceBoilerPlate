'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });




//Function to delete food Vendor user
//TODO: add verification/authorization into this
exports.handler = async(event, context) => {



    try {
        await deleteVendor(event)

        return success;
    }
    catch (err) {
        console.log(err)
        return failure;
    }
}

const success = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: 'Success'
    })
}




const failure = {
    statusCode: 400,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: 'failed to delete food Vendor object'
    })
}


const deleteVendor = (event) => {

    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email } = JSON.parse(event.body);



    const params = {
        TableName: "Runners",
        Key: {
            email: email
        }
    }

    return documentClient.delete(params).promise();


}