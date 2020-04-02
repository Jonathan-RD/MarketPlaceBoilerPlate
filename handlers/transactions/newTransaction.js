'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });

//Function to create new Transaction object
exports.handler = async(event, context) => {



    try {
        await postTransaction(event)

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


const postTransaction = (event) => {

    const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const { email, id, amount, costPerItem, date, notes, itemName, Vendor, VendorPhone, CustomerPhone, Customer, recall } = JSON.parse(event.body);
    console.log(event.body);
       

    const params = {
        TableName: "Transactions",
        Item: {
            id: id,
            milliseconds: getDate().milliseconds,
            amount: amount,
            costPerItem: costPerItem,
            date: getDate().today,
            notes: notes,
            itemName: itemName,
            email: email,
            Customer: Customer,
            Vendor: Vendor,
            VendorPhone: VendorPhone,
            CustomerPhone: CustomerPhone,
            recall: false,
            status: "Scheduled"
           
            
            
            

        }
    }
        
            
            
            return documentClient.put(params).promise();


}



const getDate = ()=>{

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var formatted = mm + '/' + dd + '/' + yyyy;

    return {
       "today": formatted,
       "milliseconds": today
    }


    




}