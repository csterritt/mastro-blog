import server from "@mastrojs/mastro/server";

const port = 8000;
Bun.serve({
  port,
  fetch: server.fetch,
});

console.log(`Server running at http://localhost:${port}`);
