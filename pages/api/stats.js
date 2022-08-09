import { verifyToken } from "@utils/verifyToken";
import {
  findVideoIdbyUserId,
  updateStats,
  insertStats,
} from "@utils/db/hasura";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      const { videoId } = req.method === "POST" ? req.body : req.query;
      if (videoId) {
        const userId = await verifyToken(token)
        const video = await findVideoIdbyUserId(token, userId, videoId);
        const videoExists = video.length > 0;

        // GET requeest
        videoExists
          ? res.send({ msg: "done", video })
          : res.send({ msg: "video not found" });

        // POST request
        if (req.method === "POST") {
          const { watched, favorite } = req.body;
          if (videoExists) {
            const updateQuery = await updateStats({
              token,
              userId,
              videoId,
              watched,
              favorite,
            });
            res.send({ msg: "done", updateQuery });
          } else {
            const insertQuery = await insertStats({
              token,
              userId,
              videoId,
              watched,
              favorite,
            });
            res.send({ msg: "done", insertQuery });
          }
        }
      } else {
        res.status(403).send({ msg: "unauthorized." });
      }
    }
  } catch (err) {
    console.log("Error occured /stats", err);
    res.status(500).send({ done: false, error: err?.message });
  }
}
