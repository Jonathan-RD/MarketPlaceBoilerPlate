'use strict'
const AWS = require('aws-sdk');
const crypto = require("crypto")

AWS.config.update({ region: "us-east-1" });
const CRYPTO_BYTE_SIZE = 64;



//Function to register new food Vendor
//TODO: Create single function to handle all registration
exports.handler = async(event, context) => {

    try {
        await createVendor(event);

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
        message: 'Welcome to BoilerPlate!!'
    })
}   





const failure = {
    statusCode: 400,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: 'Failed to create account'
    })
}


const createVendor = async (event) => {

   

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email, VendorName, pickupDays, name, position, number, password, address} = JSON.parse(event.body);

     const { salt, hash} = await computeHash(password);

     var contact = {
          name,
        position,
        number
     }

    const params = {
        TableName: "Vendors",
        Is64BitEncoding: true,
        Item: {
            VendorName: VendorName,
            email: email,
            pickupDays: pickupDays,
            passwordHash: hash.toString(),
            passWordSalt: salt,
            contact: contact, 
            location: address
            

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
