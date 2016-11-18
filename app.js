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

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Flip A Coin|Roll Dice|Magic 8-Ball|Quit');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('/News');
                break;
            case 1:
                session.beginDialog('/Benefits');
                break;
            case 2:
                session.beginDialog('/People Search');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/menu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });


bot.dialog('/News', [
    function (session, args) {
        builder.Prompts.text(session, "Here are the top news from eBay")
    },
    function (session, results) {
        var entered_reply = results.response.entity;
        getTopNews(session, function(result){    
            var latest_news = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(result);
            session.endDialog(latest_news);
        });
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
