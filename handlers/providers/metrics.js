const AWS = require('aws-sdk')
const AuthHelper = require(".././authentication/authHelper.js")






//Function to return food Transaction metrics for Vendors' internal use
exports.handler = async (event) => {

    var costSavings = 0;
    var mealsSaved = 0;
    var popularItem = "N/A"; //default state if no Transaction history exists 
    var retailSavings = 0;

    const allItems = [];


    const helper = new AuthHelper();

    const authCode = helper.verify(event.headers.Authorization.split(" ")[1])

    if (authCode == 401) {
        return unauthorized;
    }




    try {



        var dbItems = await fetchItems(event.pathParameters.email);


        if (dbItems.Items.length > 0) {


            dbItems.Items.forEach((Transaction) => {

                Transaction.food.forEach(foodItem => {
                    retailSavings += (foodItem.retail * foodItem.amount);
                    costSavings += (foodItem.cost * foodItem.amount)
                    mealsSaved += foodItem.amount;
                    addToArray(foodItem.amount, foodItem.itemName, allItems);
                })


            });
        }





        costSavings = "$" + costSavings;
        retailSavings = "$" + retailSavings;



        if (costSavings.charAt(costSavings.length - 2) == ".") {
            costSavings += "0";
        }
        if (retailSavings.charAt(retailSavings.length - 2) == ".") {
            retailSavings += "0"
        }




        var metricsMap = {
            costValue: costSavings,
            retailValue: retailSavings,
            foodItems: mealsSaved,
            mostCommon: allItems.length > 0 ? await mostCommon(allItems) : popularItem
        }



        return success(metricsMap);



    } catch (err) {
        console.log(err)
        return failure;
    }



}

const addToArray = (number, item, allItems) => {

    for (var i = 0; i < number; i++) {
        allItems.push(item);
    }




}

//Function to fetch most common item in array
const mostCommon = (array) => {

    var counts = {};
    var compare = 0;
    var mostFrequent;

    for (var i = 0, len = array.length; i < len; i++) {
        var word = array[i];

        if (counts[word] === undefined) {
            counts[word] = 1;
        } else {
            counts[word] = counts[word] + 1;
        }
        if (counts[word] > compare) {
            compare = counts[word];
            mostFrequent = array[i];
        }
    }
    return mostFrequent;


}



const fetchItems = (email) => {

    var params = {
        TableName: "Transactions",

        ExpressionAttributeValues: {
            ':email': email,
            ':status': "Scheduled"


        },

        ExpressionAttributeNames: {
            "#status": "status"
        },
        FilterExpression: 'email = :email and #status <> :status'

    }

    var DocumentClient = new AWS.DynamoDB.DocumentClient();

    return DocumentClient.scan(params).promise();

}

const success = (metrics) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },

        body: JSON.stringify({
            metrics
        })
    }
}


const failure = {

    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },

    body: "Sorry Metrics Could Not be Fetched"

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