const AWS = require('aws-sdk');
const AuthHelper = require("../authentication/authHelper")



// Function to get Transaction history of a user
exports.handler = async (event) => {
   
   
    const helper = new AuthHelpher();

    const authCode = helper.verify(event.headers.Authorization.split(" ")[1])
   
    if(authCode == 401){
        return unauthorized;
    }
     
   
   
   
    try{
    

     const {email} = event.pathParameters;
     const {startDate, endDate} = event.queryStringParameters;

        //Convert date into sortkey for fetching Transactions
      const data = await fetchTransactions(email, getMilliseconds(startDate), getMilliseconds(endDate) );
       
      
       return success(data.Items);
       
   }catch(err){
       console.log(err);
       return failure;
   }
   
  
};
 





/*Function which parses string formatted date and converts it to milliseconds
  which is used for sort keys  */
const getMilliseconds = (isoDate)=>{

var date = new Date(isoDate + " 00:00:00");
var milliseconds = date.getTime();
return Number(milliseconds);

}



// Fetches Transactions within provided date range 
const fetchTransactions = (email, startDate, endDate)=>{
    
    
    var params = {
        TableName: "Transactions", 
        
       
        
        ExpressionAttributeValues:{
            ':email': email,
            ':startDate': startDate, 
            ':endDate': endDate      
        },
       
        FilterExpression: startDate && endDate == null ? 'email = :email': 'email = :email and milliseconds >= :startDate and milliseconds <= :endDate'
        

    }
    
    
    var DocumentClient = new AWS.DynamoDB.DocumentClient();
    
    
    return DocumentClient.scan(params).promise();
    
    
}


const success = (data) => {
  
  return {
      statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({"history": data})
  }
  
    
}




const failure = {
    statusCode: 400,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: 'Failed To Fetch Transaction History'
    })
}

const unauthorized = {
    statusCode: 401,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: 'Unauthorized'
    })
}