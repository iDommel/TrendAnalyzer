import Snoowrap from "snoowrap";
import "dotenv/config";

const snoowrap = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

snoowrap
  .getSubreddit("AskReddit")
  .getWikiPage("bestof")
  .content_md.then(console.log);
