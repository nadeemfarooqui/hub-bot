module.exports = {
    fetch_top_news: function (page_index=0, callback) {
        var fs = require('fs');
        fs.readFile('./json_data/topnews.json', 'utf8', function (err, data) {   
            var top_news = [];    
            var news;          
            news = JSON.parse(data).data;     
            news.forEach(function(news){        
                var news_item = {};
                news_item["title"] = news.title;
                news_item["subtitile"] = news.subTitle;
                news_item["image_url"] = news.absimageUrl.replace('https://hubpub.corp.ebay.com','https://hub.corp.ebay.com');
                top_news.push(news_item);
            });
            if (page_index > 3) {page_index = 3;}
            var result = top_news.slice((4*page_index),(4*page_index)+4);
            callback(result);
        });            
    }
}
