const AWS = require("aws-sdk");
const Notification= require("./notification.js")

exports.handler = async (event)=>{


// Function to change status of transaction
try{
 



    const pathParams = event.pathParameters.key.split("..");

    const payload = JSON.parse(event.body);

    await changeStatus(pathParams[0], pathParams[1], payload.newStatus, payload.Runner);

   const notif = new Notification();
   switch(payload.newStatus){


    case "Ready for Pickup":
   await notif.sendToRunners(payload.Vendor);
    break;
    case "In Transit":
    await notif.sendToCustomer(payload.CustomerPhones, payload.Vendor);
    break;
    case "Delivered":
    await notif.sendToVendor(payload.VendorPhone,payload.Vendor);
    await autoPopulate(pathParams[0]);
    break;
    default : 
    " ";
    
   }

    return success


}
catch(err){
console.log(err);
return failure(err);

}


}


const changeStatus = (email, milliseconds, newStatus, Runner)=>{

    
const DocumentClient = new AWS.DynamoDB.DocumentClient();

var expression = "";

var ExpressionValues = {};



if ( Runner != null){
    
    expression = "Set #status = :st, Runner = :run pickupTime = :pickupTime"
     
   ExpressionValues = {
        ":st": newStatus,
        ":run": Runner,
        ":pickupTime": getTime()
    };
    
    
    
}
else if(newStatus === "Delivered"){
     expression = "Set #status= :st, CustomerReceived= :receivedTime";
     
   ExpressionValues = {
        ":st": newStatus,
        ":receivedTime": getTime()
       
    };
    
}else{
    expression = "Set #status= :st";
     
    ExpressionValues = {
         ":st": newStatus,
         
        
     };
}




var params = {
    TableName: "Transactions",
    Key: {
        email: email,
        milliseconds: Number(milliseconds)
    },



    ExpressionAttributeNames:{
        "#status" : "status",

    },
    ExpressionAttributeValues: ExpressionValues,
    
  

    UpdateExpression: expression,

    ReturnValues: "UPDATED_NEW"
}

return DocumentClient.update(params).promise();

}



/* Automated creation of new scheduled Transaction for
the owner of the current Transaction being handled */

const autoPopulate = async (email) =>{
   
   
   var milli = await getMilliseconds();
   
   var TransactionDate = await currentDate(milli)
   
   
   console.log(TransactionDate)
   
    const DocumentClient = new AWS.DynamoDB.DocumentClient();

    //TODO: fill in values
    var params = {
        TableName: "Transactions",
        Item: {
            email: email,
            milliseconds: milli,
            Runner: {},
            food: [],
            status: "Scheduled",
            Customer: "",
            Vendor: "",
            CustomerPhones: [""],
            CustomerAddress: "",
            VendorPhone: "",
            TransactionDate: TransactionDate



        },
    
       
    }
    
    return DocumentClient.put(params).promise();




}


// Get future date of scheduled Transaction
const currentDate = async (mili) => {


    var today = new Date(mili);
    var dd = String(today.getDate()).padStart(2, '0');
    var options = { month: "long" };
    var mm = new Intl.DateTimeFormat('en-US', options).format(today).substring(0, 3).toUpperCase();
    
   
        
        return mm + " " + dd;
    
    
    }




const getTime = () =>{

    var date = new Date();

    return `${date.getHours}:${date.getHours}`



}


// Utility function to fetch sortkey for Transaction item
const getMilliseconds =()=>{
    var milliseconds = getToday();
    var date = new Date();
    date.setHours(0,0,0,0)

    var day = date.getDay();

    if (day === 4){
        milliseconds += 172800000;
    }
    else if (day === 6){
        milliseconds += 432000000;
    }




return milliseconds;

}




const success =

    {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: "Status updated successfully ",
    }




const getToday =()=>{
    
    var d = new Date();
    d.setHours(0,0,0,0);
    
    return d.getTime()
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