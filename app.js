/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hi, welcome to Friendzy! What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.choice(session, "Hi " + results.response + ", what's one of your interests?", 
                               ["Coding", "Sports", "Music", "Business"]); 
    },
    function (session, results) {
        session.userData.interest = results.response.entity;
        builder.Prompts.choice(session, "Nice choice! Do you want us to search for people with similar interests for you to chat with?", ["Yes", "Not now"]);
    },
    function (session, results) {
        session.userData.active = results.response.entity;
        session.send("Great! We'll notify you if we find someone.");
    }
]);
