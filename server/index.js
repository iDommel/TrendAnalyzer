import Snoowrap from "snoowrap";
import "dotenv/config";
import express from "express";
import cors from "cors";

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

app.get("/", async (req, res) => {
  const { query } = req;
  console.log(query);

  const newPosts = await snoowrap
    .getSubreddit(query.param)
    .getNew({ options: { time: "month" } });
  console.log(newPosts.length);
  return res.status(200).send(query);
});
