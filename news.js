'use strict';
function fetch_top_news(page_index=0, callback) {
    result = [];
    callback(result);
}

let news = {
    fetch_top_news:fetch_top_news
};

module.exports = news;