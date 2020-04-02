const AWS = require('aws-sdk');


//Function to add food item 
exports.handler = async(event) => {



    try {

        var pathParams = event.pathParameters.id.split("..");

        await addItem(pathParams[0], pathParams[1], JSON.parse(event.body));

        return success;

    }
    catch (err) {


        return failure(err);
    }


};


const addItem = (email, milliseconds, body) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "Transactions",
        Key: {
            email: email,
            milliseconds: Number(milliseconds) //convert from string to number since sortkey is a number
        },

        ExpressionAttributeNames: {
            "#food": "food"
        },

        UpdateExpression: "Set #food = list_append(#food,:a)",

        ExpressionAttributeValues: {
            ":a": [body]

        },
        ReturnValues: "UPDATED_NEW"
    }


    return documentClient.update(params).promise();



}




const success = {


    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: "Success"
}



const failure = (err) => {
    return {
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: err
        })
    }
}
