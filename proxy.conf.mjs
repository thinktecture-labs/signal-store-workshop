// .env (your own key) takes precedence over .env.example (the workshop key)
import { config } from "dotenv";

config({ path: [".env", ".env.example"], quiet: true });

export default {
  "/api/tmdb": {
    target: "https://api.themoviedb.org/3",
    secure: true,
    pathRewrite: {
      "^/api/tmdb": "",
    },
    changeOrigin: true,
    configure(proxy) {
      proxy.on("proxyReq", (proxyReq) => {
        proxyReq.setHeader(
          "Authorization",
          `Bearer ${process.env.TMDB_API_KEY}`,
        );
        proxyReq.setHeader("Content-Type", "application/json");
      });
    },
    logLevel: "debug",
  },
};
