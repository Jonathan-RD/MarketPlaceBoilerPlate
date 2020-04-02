const AWS = require('aws-sdk');



// Utility class to handle SMS notification system
class Notification{

constructor(){

}



async sendToVendor(VendorPhone, VendorName) {

    await this.sendPing(`Hey ${VendorName} your Transaction has been delivered to ${customerName}`, VendorPhone);
}




async sendToCustomer (CustomerPhones, Vendor) {

    await Promise.all(CustomerPhones.map(async(number)=>{
               
        await this.sendPing(`Hey ${customerName}, keep an eye out, a food Transaction is coming your way from ${Vendor}. A Runner is bringing a Transaction to you`, number);

     }))



}


async sendToRunners(Vendor){


    const data = await this.queryNumbers();



    await Promise.all(data.Items.map(async(Runner) => {
        
        await this.sendPing(this.buildMsg(Vendor, Runner), Runner.phoneNumber);
    }))

}





// Utility function to build message for Runners
buildMsg  (Vendor, Runner)  {


    var name = Runner.firstName +" "+ Runner.lastName;
    var formattedName = name.replace(' ', '-')
    return `Hey ${Runner.firstName},  ${Vendor}  has food available for pickup and delivery today at 4PM. Please let us know if you are available for pickup within the hour.  Click here to accept website.com/${formattedName}}`

}


 async sendPing  (message, number) {

    AWS.config.update({ region: 'us-east-1' });

    // Create publish parameters
    var params = {
        Message: message,
        /* required */
        PhoneNumber: '+1' + number,

    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({ apiVersion: "2012-10-17" }).publish(params).promise();

    return publishTextPromise.then((data) => {
            console.log("Sent Successfully")

        })
        .catch(err => {
            console.log("Sending failed", err);

        });



}

queryNumbers()  {

    var params = {
        TableName: 'Runners',

    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    return documentClient.scan(params).promise();

}






}

module.exports = Notification