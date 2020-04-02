const AWS = require('aws-sdk')



//Function to fetch all Runners
exports.handler = async(event) => {
  try {
    var Runners = await queryRunners();

    return success(Runners);
  }
  catch (err) {
    console.log(err)
    return failure;
  }
};





const queryRunners = () => {

  var params = {
    TableName: 'Runners',

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
    body: JSON.stringify(
      Vendors
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
