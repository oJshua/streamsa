// make sure your node.js version supports async/await (v10 and above should be fine)
// npm i request cheerio request-promise-native
const rp = require('request-promise-native'); // requires installation of `request`
const cheerio = require('cheerio');

class FbScrape {
    constructor(options={}) {
        this.headers = options.headers || {
            'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0' // you may have to update this at some point
        };
    }

    async getPosts(pageUrl, limit=20) {
        const staticPostsHtml = await rp.get({ url: pageUrl, headers: this.headers });
        if (limit <= 20) {
            return this._parsePostsHtml(staticPostsHtml);
        } else {
            let staticPosts = this._parsePostsHtml(staticPostsHtml);
            const nextResultsUrl = this._getNextPageAjaxUrl(staticPostsHtml);
            const ajaxPosts = await this._getAjaxPosts(nextResultsUrl, limit-20);
            return staticPosts.concat(ajaxPosts);
        }
    }

    _parsePostsHtml(postsHtml) {
        const $ = cheerio.load(postsHtml);
        const timeLinePostEls = $('.userContent').map((i,el)=>$(el)).get();
        const posts = timeLinePostEls.map(post => {
            return {
                message: post.html(),
                created_at: post.parents('.userContentWrapper').find('.timestampContent').html()
            }
        });
        return posts;
    }

    async _getAjaxPosts(resultsUrl, limit=8, posts=[]) {
        const responseBody = await rp.get({ url: resultsUrl, headers: this.headers });
        const extractedJson = JSON.parse(responseBody.substr(9));
        const postsHtml = extractedJson.domops[0][3].__html;
        const newPosts = this._parsePostsHtml(postsHtml);
        const allPosts = posts.concat(newPosts);
        const nextResultsUrl = this._getNextPageAjaxUrl(postsHtml);
        if (allPosts.length+1 >= limit)
            return allPosts;
        else
            return await this._getAjaxPosts(nextResultsUrl, limit, allPosts);
    }

    _getNextPageAjaxUrl(html) {
        return 'https://www.facebook.com' + /"(\/pages_reaction_units\/more[^"]+)"/g.exec(html)[1].replace(/&amp;/g, '&') + '&__a=1';
    }
}

const fbScrape = new FbScrape();
const minimum = 28; // minimum number of posts to request (gets rounded up to 20, 28, 36, 44, 52, 60, 68 etc... because of page sizes (page1=20; all_following_pages=8)
fbScrape.getPosts('https://www.facebook.com/Sol.Luna.Xi', minimum).then(posts => { // get at least the 28 latest posts
    // Log all posts
    for (const post of posts) {
        console.log(post.created_at, post.message);
    }
});
