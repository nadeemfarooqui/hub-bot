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

// Bot dialog
bot.dialog('/', [
    function (session) {
            session.send('Welcome to the Hub bot!');
            builder.Prompts.text(session, 'Reply to hear the latest news...');
    },

    function (session, results) {
        var entered_reply = results.response.entity;
        getTopNews(session, function(result){    
            var latest_news = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(result);
            session.send(latest_news);
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