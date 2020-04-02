'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });




// Function to delete Customer 
exports.handler = async(event, context) => {


  //TODO: add verification/authorization into this
    try {
        await deleteCustomer(event)

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
        message: 'Failed to delete Customer object'
    })
}


const deleteCustomer = (event) => {

   

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email } = JSON.parse(event.body);



    const params = {
        TableName: "Customers",
        Key: {
            email: email
        }
    }

    return documentClient.delete(params).promise();


}
