'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });




//Fetches particular food Vendor
exports.handler = async(event, context) => {



    try {
        const data = await getVendor(event)

        return success(data);
    }
    catch (err) {

        console.log(err)

        return failure;
    }
}




const success = (data) => {


    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.Item)
    }
}


const failure = {
    statusCode: 400,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: 'failed to fetch Vendor'
    })
}



const getVendor = (event) => {

    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email } = event.pathParameters;



    const params = {
        TableName: "Vendors",
        Key: {
            email: email,
        }
    }

    return documentClient.get(params).promise();


}