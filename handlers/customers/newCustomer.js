'use strict'
const AWS = require('aws-sdk');
const crypto = require("crypto")
AWS.config.update({ region: "us-east-1" });
const CRYPTO_BYTE_SIZE = 64;


//Function to register new Customer
exports.handler = async(event, context) => {



    try {
        await postCustomer(event)

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
        message: 'failed to create Customer object'
    })
}
   

const postCustomer = async (event) => {

    

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email,CustomerName, phone, password, accountAdmin, address} = JSON.parse(event.body);

    const { salt, hash } = await computeHash(password);


    const params = {
        TableName: "Customers",
        Item: {
           email: email,
           phones: phone,
           passwordHash: hash.toString(),
           CustomerName: CustomerName,
           accountAdmin: accountAdmin,
           address: address,
           salt: salt,
           
           
           
        }
    }

    return documentClient.put(params).promise();


}


const computeHash = (password) => {
    const iterations = 4096
    const salt = crypto.randomBytes(CRYPTO_BYTE_SIZE).toString('base64')
    const token = crypto.randomBytes(CRYPTO_BYTE_SIZE).toString('base64')
  
    const hash = crypto.pbkdf2Sync(password, salt, iterations, CRYPTO_BYTE_SIZE, 'sha512').toString('base64')
    return new Promise((resolve, reject) => {
      resolve({ hash, salt, token })
    })
  }
