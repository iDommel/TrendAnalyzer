import Snoowrap from "snoowrap";

const snoo = new Snoowrap({
    userAgent: 'TrendAnalyser',
    clientId: 'gnCLiW2VcWC6FC6TxtAxMw',
    clientSecret: '6xsJ-iKbKGezB5wP14Aa8gMm6iW-iw',
    username: "Dependent-Rough9154",
    password: "coucou1234"
});

snoo.getSubreddit('AskReddit').getWikiPage('bestof').content_md.then(console.log);
