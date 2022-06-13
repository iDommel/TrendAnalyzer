import Snoowrap from "snoowrap";
import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
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

const getCommentsPerUser = async (subReddit, resBody) => {
  try {
    const resp = await axios.get(
      `https://api.pushshift.io/reddit/search/comment/?subreddit=${subReddit.display_name}&size=0&metadata=true`
    );

    const result = {
      ...resBody,
      commentsPerSub: resp.data.metadata.total_results / subReddit.subscribers,
      totalComments: resp.data.metadata.total_results,
    };
    return result;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resBody;
};

const getPostsPerUser = async (subReddit, resBody) => {
  const url = `https://api.pushshift.io/reddit/search/submission/?subreddit=${subReddit.display_name}&size=0&metadata=true`;
  try {
    const resp = await axios.get(url);

    const result = {
      ...resBody,
      postsPerSub: resp.data.metadata.total_results / subReddit.subscribers,
      totalPosts: resp.data.metadata.total_results,
    };
    return result;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resBody;
};

const getWordUsagePerSubreddit = async (keyword, resBody) => {
  const url = `https://api.pushshift.io/reddit/search/comment/?q=${keyword}&after=7d&aggs=subreddit&size=0`;

  try {
    const resp = await axios.get(url);
    console.log(resp.data);
    console.log(resp.data.metadata);

    const result = {
      ...resBody,
    };
    return result;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resBody;
};

const getPostsWeekly = async (subReddit, resBody) => {
  const url_last = `https://api.pushshift.io/reddit/search/submission/?subreddit=${subReddit.display_name}&after=7d&size=0&metadata=true`;
  const url_snd_last = `https://api.pushshift.io/reddit/search/submission/?subreddit=${subReddit.display_name}&before=7d&after=14d&size=0&metadata=true`;

  try {
    const resp1 = await axios.get(url_last);
    const resp2 = await axios.get(url_snd_last);

    const totalPostsWeekly = resp1.data.metadata.total_results;
    const totalPostsWeeklyPrev = resp2.data.metadata.total_results;
    const increasePost =
      ((totalPostsWeekly - totalPostsWeeklyPrev) / totalPostsWeeklyPrev) * 100;
    const result = {
      ...resBody,
      postsPerSubWeekly:
        resp1.data.metadata.total_results / subReddit.subscribers,
      totalPostsWeekly,
      postsPerSubWeeklyPrev:
        resp2.data.metadata.total_results / subReddit.subscribers,
      totalPostsWeeklyPrev,
      increasePost,
    };
    return result;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resBody;
};

const getCommentsWeekly = async (subReddit, resBody) => {
  const url_last = `https://api.pushshift.io/reddit/search/comment/?subreddit=${subReddit.display_name}&after=7d&size=0&metadata=true`;
  const url_snd_last = `https://api.pushshift.io/reddit/search/comment/?subreddit=${subReddit.display_name}&before=7d&after=14d&size=0&metadata=true`;

  try {
    const resp1 = await axios.get(url_last);
    const resp2 = await axios.get(url_snd_last);

    const totalCommentsWeekly = resp1.data.metadata.total_results;
    const totalCommentsWeeklyPrev = resp2.data.metadata.total_results;
    const increaseComments =
      ((totalCommentsWeekly - totalCommentsWeeklyPrev) /
        totalCommentsWeeklyPrev) *
      100;
    const result = {
      ...resBody,
      postsPerSubWeekly:
        resp1.data.metadata.total_results / subReddit.subscribers,
      totalCommentsWeekly,
      postsPerSubWeeklyPrev:
        resp2.data.metadata.total_results / subReddit.subscribers,
      totalCommentsWeeklyPrev,
      increaseComments,
    };
    return result;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resBody;
};

app.get("/", async (req, res) => {
  const { query } = req;
  let resBody = {};
  if (!query.param)
    return res.status(400).send({ message: "param is required" });

  // resBody = await getWordUsagePerSubreddit(query.param, resBody);
  const subReddit = await snoowrap.searchSubreddits({
    query: query.param,
    limit: 1,
  })[0];
  if (subReddit) {
    resBody = await getCommentsPerUser(subReddit, resBody);
    resBody = await getPostsPerUser(subReddit, resBody);
    resBody = await getPostsWeekly(subReddit, resBody);
    resBody = await getCommentsWeekly(subReddit, resBody);
    resBody = {
      ...resBody,
      subscribers: subReddit.subscribers,
      discplay_name: subReddit.display_name,
      title: subReddit.title,
    };
    return res.status(200).send(resBody);
  }
  res.status(404).send("found no subreddit for that keyword");
});
