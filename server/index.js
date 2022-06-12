import Snoowrap from "snoowrap";
import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT || 5000;

const snoowrap = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

app.listen(PORT, () =>
  console.log(`server listening on port http://localhost:${PORT}`)
);

app.get("/askreddit/bestof", (req, res) => {
  snoowrap
    .getSubreddit("AskReddit")
    .getWikiPage("bestof")
    .content_md.then((thing) => {
      console.log(thing);
      return res.status(200).send({ message: thing });
    });
});

const getNbNewPosts = async (subReddit, resBody) => {
  const url = `https://api.pushshift.io/reddit/search/submission/?subreddit=${subReddit.display_name}&after=24h&size=0&metadata=true`;

  try {
    const res = await axios.get(url);
    return {
            ...resBody,
            nbNewPosts: res.data.metadata.total_results
          };
  } catch (err) {
    console.log(err);
  }
  return resBody
}

const getNbNewComments = async (subReddit, resBody) => {
  const url = `https://api.pushshift.io/reddit/search/comment/?subreddit=${subReddit.display_name}&after=24h&size=0&metadata=true`;

  try {
    const res = await axios.get(url);
    return {
            ...resBody,
            nbNewComments: res.data.metadata.total_results
          };
  } catch (err) {
    console.log(err);
  }
  return resBody
}

app.get("/", async (req, res) => {
  const { query } = req;
  console.log(query);

  const subReddit = await snoowrap.searchSubreddits({ query: query.param, limit: 1 })[0];
  console.log(subReddit.title);
  console.log(`Subscribers: ${subReddit.subscribers}`);

  const response = {nbNewPost: newPosts.data.metadata.total_results, nbNewComment: newComments.data.metadata.total_results};

  console.log(response);
  return res.status(200).send(query);
});
