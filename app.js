var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'df36b1dc-b905-4c93-8fa1-62ae925796eb',
    appPassword: '2muGjGdNz3bo0hv4YAatd3i'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Bot dialog
bot.dialog('/', [

    function (session) {
            session.send('Welcome to the eBay Hub bot!');
            builder.Prompts.text(session, 'Reply to hear the latest news...');
    },

    function (session, results) {
        var entered_reply = results.response.entity;
        var cards = getCardsAttachments();    
        // create reply with Carousel AttachmentLayout
        var latest_news = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);
        session.send(latest_news);
    }
]);

function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title("2016's Spooktacular Costumes and Decorations")
            .text("From Japan to San Jose HQ, heres our global Halloween spirit caught on camera.")
            .images([
                builder.CardImage.create(session, 'https://drive.google.com/file/d/0B-NGOvtFqq-yRmQ2SjZnMVhTNGs/preview')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10292/', 'More')
            ]),

        new builder.ThumbnailCard(session)
            .title("eBay Rises to the \"Bake Off\" Challenge")
            .subtitle('Blazing fast, planet-scale NoSQL')
            .text('Sales jump on eBay in conjunction with the popular BBC show.')
            .images([
                builder.CardImage.create(session, 'https://drive.google.com/file/d/0B-NGOvtFqq-yRXo5RUxYWFU3Vk0/preview')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10295/', 'More')
            ]),

        new builder.HeroCard(session)
            .title('U.S. Benefits Open Enrollment')
            .text('Open Enrollment (Nov. 1-11) is the time to make sure your benefits coverage keeps up with your needs.')
            .images([
                builder.CardImage.create(session, 'https://drive.google.com/file/d/0B-NGOvtFqq-yV2FHODNJODdPQWM/preview')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10283/', 'More')
            ]),

        new builder.ThumbnailCard(session)
            .title('Making everyone a WIN-ner')
            .subtitle('Build powerful intelligence into your applications to enable natural and contextual interactions')
            .text('Enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge.')
            .images([
                builder.CardImage.create(session, 'https://drive.google.com/file/d/0B-NGOvtFqq-yWWJuazNzQVhNTFk/preview')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10279/ ', 'More')
            ])
    ];
}
