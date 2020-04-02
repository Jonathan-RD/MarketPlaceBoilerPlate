'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });



//Function to fetch particular Runner
exports.handler = async(event, context) => {



    try {
        const data = await getRunner(event)

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
        message: 'failed to create Runner object'
    })
}



const getRunner = (event) => {

    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email } = event.pathParameters;



    const params = {
        TableName: "Runners",
        Key: {
            email: email,
        }
    }

    return documentClient.get(params).promise();


}
