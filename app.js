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
                builder.CardImage.create(session, 'https://lh4.googleusercontent.com/f0nGtJFK2ZA74paeZ3fm0Q3XjruMqtsyhyFJ59X2uBs4hdihb35SeRV41UF_VYsTlzX9CNIWTvXSPug=w2880-h1468')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10292/', 'More')
            ]),

        new builder.ThumbnailCard(session)
            .title("eBay Rises to the \"Bake Off\" Challenge")
            .subtitle('Blazing fast, planet-scale NoSQL')
            .text('Sales jump on eBay in conjunction with the popular BBC show.')
            .images([
                builder.CardImage.create(session, 'https://lh3.googleusercontent.com/zpMaSXShmOaEoumjnOk2LNCDgHuUBF2RA-NXeNfwgEu2dRrXDA_V_eiH--8xmSaRFGtQBo7-OdPQYl0=w2880-h1468')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10295/', 'More')
            ]),

        new builder.HeroCard(session)
            .title('U.S. Benefits Open Enrollment')
            .text('Open Enrollment (Nov. 1-11) is the time to make sure your benefits coverage keeps up with your needs.')
            .images([
                builder.CardImage.create(session, 'https://lh4.googleusercontent.com/Y78bwHbiqGL8M24YQ8OZVF3DoMifTsX2WZXvvPh89WjLGPTYPkb88vyQ1GYMnkLQMYGdgx35ku1suyE=w2880-h1468')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10283/', 'More')
            ]),

        new builder.ThumbnailCard(session)
            .title('Making everyone a WIN-ner')
            .subtitle('Build powerful intelligence into your applications to enable natural and contextual interactions')
            .text('Enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge.')
            .images([
                builder.CardImage.create(session, 'https://lh4.googleusercontent.com/0_xFAozSGi9iMam_2K4JH-tNeSwOzoZsOT1kgYiHtZQhJMLsAKXMKKKVJsqnn-6EsXrIcpWrNynqA3E=w2880-h1468')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://hub.corp.ebay.com/news/10279/ ', 'More')
            ])
    ];
}
