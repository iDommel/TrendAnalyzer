import Snoowrap from "snoowrap";
import "dotenv/config";
import express from "express";

const app = express();

const PORT = process.env.PORT || 8080;

// const snoowrap = new Snoowrap({
//   userAgent: process.env.REDDIT_USER_AGENT,
//   clientId: process.env.REDDIT_CLIENT_ID,
//   clientSecret: process.env.REDDIT_CLIENT_SECRET,
//   username: process.env.REDDIT_USERNAME,
//   password: process.env.REDDIT_PASSWORD,
// });

app.listen(PORT, () =>
  console.log(`server listening on port http://localhost:${PORT}`)
);

app.get("/", (req, res) => {});

// snoowrap
//   .getSubreddit("AskReddit")
//   .getWikiPage("bestof")
//   .content_md.then(console.log);
