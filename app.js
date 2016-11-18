'use strict';

var builder = require('botbuilder');
var restify = require('restify');

let news_lib = require('./news');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Hubx Bot")
            .text("Your bot to get information from Hubx.")
            .images([
                 builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm the Hubx bot.");
        session.beginDialog('/help');
    },
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);


bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What are you looking for?", ["News","Benefits","People-Search","quit"]);
    },
    function (session, results) {
       if (results.response && results.response.entity != '(quit)') {
            session.beginDialog('/' + results.response.entity);
        } else {
            session.endDialog();
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^(menu|show menu)/i });


bot.dialog('/News', [
    function (session) {
        session.send("Here are the top news from ebay...");
        session.sendTyping();
        getTopNews(session, function(result){    
            var latest_news = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(result);
            session.endDialog(latest_news);
        });
    }
]);

bot.dialog('/Benefits', [
    function (session) {
        session.send("Benefits under construction...");
        session.endDialog();
    }
]);


bot.dialog('/People-Search', [
    function (session) {
        session.send("People-Search under construction...");
        session.endDialog();
    }
]);

function getTopNews(session, callback) {
    news_lib.fetch_top_news(0, function (result) {
        var hero_cards = []
        result.forEach(function(news){
           hero_cards.push(new builder.HeroCard(session)
            .title(news.title)
            .text(news.subtitile)
            .images([
                builder.CardImage.create(session, news.image_url)
            ])
           );        
        });
        callback(hero_cards);
    });
}
