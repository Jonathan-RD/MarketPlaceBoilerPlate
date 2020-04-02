const AWS = require("aws-sdk");


//Function to fetch a particular transaction
exports.handler = async (event)=>{



    try{

       const pathParam = event.pathParameters.key.split("..");

        const data = await getTransaction(pathParam[0], pathParam[1]);

        return success(data);
    }
    catch(err){
    
       console.log(err);
     
        return failure;
    
    }


}


const getTransaction= (email, milliseconds) =>{

    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });


    const params = {
        TableName: "Transactions",
        Key: {
            email: email,
            milliseconds: Number(milliseconds)
        }
    }

    return documentClient.get(params).promise();

}

const success = (data) => {
  
    return {
        statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data),
    }
    
      
  }
  
  
  
  
  const failure = {
      statusCode: 400,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          message: 'Failed To Fetch Transaction item'
      })
  }