const AWS = require('aws-sdk')


//Function to fetch all Customer users
exports.handler = async(event) => {
  try {
    var Customers = await queryCustomers();

    return success(Customers);
  }
  catch (err) {
    console.log(err)
    return failure;
  }
}; 





const queryCustomers = () => {

  var params = {
    TableName: 'Customers',

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
    body: JSON.stringify({
      Vendors}
    )
  }



}

const failure = {

  statusCode: 400,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    message: 'Failed to fetch Customers'
  })
}