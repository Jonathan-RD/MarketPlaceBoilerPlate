const AWS = require('aws-sdk')


//Fetches all Vendor users
exports.handler = async(event) => {
  try {
    var Vendors = await queryVendors();

    return success(Vendors);
  }
  catch (err) {
    console.log(err)
    return failure;
  }
};





const queryVendors = () => {

  var params = {
    TableName: 'Vendors',
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
    message: 'Failed to fetch Vendors'
  })
}
