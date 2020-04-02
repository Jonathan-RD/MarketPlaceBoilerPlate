const AWS = require('aws-sdk')
const AuthHelper = require("../authentication/authHelper.js")


//TODO: Discard this work around and create way to fetch Transactions more dynamically
//Fetches most recent Transaction item in dynamo table
exports.handler = async(event) => {
 
 
 
 
 
  const helper = new AuthHelper();

  const authCode = helper.verify(event.headers.Authorization.split(" ")[1])
 
  if(authCode == 401){
      return unauthorized;
  }
   
 
 
 
  try {
    var Transactions = await queryTransactions();

    return success(Transactions);
  }
  catch (err) {
    console.log(err)
    return failure;
  }
};





const queryTransactions = () => {

  var params = {
    TableName: 'Transactions',
  

  }

  var documentClient = new AWS.DynamoDB.DocumentClient();

  return documentClient.scan(params).promise();


}



const success = (Vendors) => {

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(Vendors.Items.reverse()[0])
  }



}

const failure = {

  statusCode: 400,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    message: 'Failed to fetch Transactions'})
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