const AWS = require('aws-sdk')
AWS.config.update({ region: "us-east-1" });



// Function that handles recall functionality on a particular food item
//TODO: Decide whether to publish or to kill this feature
exports.handler = async(event) => {

    try {

        var pathParams = event.pathParameters.id.split("..");
       
        const { email } = event.pathParameters;
        const { CustomerPhone, itemName, Vendor, index } = JSON.parse(event.body);

        const data = await setRecall(pathParams[0], pathParams[1], index);
        
        const bleh = await recallNotif(buildMessage(Vendor, itemName), CustomerPhone);


        return success;
    }
    catch (err) {
        console.log(err)

        return failure;
    }



};

 

const buildMessage = (Vendor, itemName) => {

    return "There is currently a recall for " + itemName + "\n" + " Our apologies " + "\n" + "-" + Vendor;


}


const setRecall = (email, sortKey, index) => {

 var expression = 'Set #food['+index+'].#recall = :t'
    const documentClient = new AWS.DynamoDB.DocumentClient();



    var params = {
        TableName: "Transactions",
        Key: {
            email: email,
            milliseconds: Number(sortKey)
        },
        ExpressionAttributeNames: {
            "#food": "food",
            "#recall": "recall"
            
        },
        UpdateExpression: expression,
        ExpressionAttributeValues: {
            ":t": true
        },

        ReturnValues: "UPDATED_NEW"

    }


    return documentClient.update(params).promise();

}




const recallNotif = async(message, number) => {

    AWS.config.update({ region: 'us-east-1' });

    // Create publish parameters
    var params = {
        Message: message,
        /* required */
        PhoneNumber: '+1' + number,

    };


    var publishTextPromise = new AWS.SNS({ apiVersion: "2012-10-17" }).publish(params).promise();

    return publishTextPromise.then((data) => {
            console.log("Sent Successfully")

        })
        .catch(err => {
            console.log("Sending failed", err);

        });

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
        message: 'failed to create Runner object'
    })
}
