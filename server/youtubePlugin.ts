import type { Plugin } from "vite";
import { loadEnv } from "vite";

export function youtubeApiPlugin(): Plugin {
  let apiKey = "";

  return {
    name: "youtube-api",
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, "");
      apiKey = env.YOUTUBE_API_KEY || "";
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        if (url.pathname !== "/api/youtube") return next();

        if (!apiKey) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "YOUTUBE_API_KEY not configured" }));
          return;
        }

        const query = url.searchParams.get("q");
        if (!query) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing q parameter" }));
          return;
        }

        try {
          const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
          searchUrl.searchParams.set("part", "snippet");
          searchUrl.searchParams.set("q", query);
          searchUrl.searchParams.set("type", "video");
          searchUrl.searchParams.set("maxResults", "1");
          searchUrl.searchParams.set("key", apiKey);

          const ytRes = await fetch(searchUrl.toString());
          if (!ytRes.ok) {
            const body = await ytRes.text();
            res.writeHead(ytRes.status, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "YouTube API error", detail: body }));
            return;
          }

          const ytData = await ytRes.json();
          const item = ytData.items?.[0];
          if (!item) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No results found" }));
            return;
          }

          const videoId = item.id.videoId as string;
          const title = item.snippet.title as string;
          const channelName = item.snippet.channelTitle as string;
          const thumbnailUrl = (item.snippet.thumbnails.medium?.url ??
            item.snippet.thumbnails.default?.url) as string;

          const imgRes = await fetch(thumbnailUrl);
          if (!imgRes.ok) {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to fetch thumbnail" }));
            return;
          }

          const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
          const base64 = `data:image/jpeg;base64,${imgBuffer.toString("base64")}`;

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ videoId, title, thumbnail: base64, channelName }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error", detail: String(err) }));
        }
      });
    },
  };
}
