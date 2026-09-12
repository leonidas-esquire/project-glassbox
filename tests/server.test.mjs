import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

test("the local quick-start server serves the application and its assets", async t => {
  const port = 43000 + (process.pid % 1000);
  process.env.HOST = "127.0.0.1";
  process.env.PORT = String(port);

  const { server } = await import("../scripts/serve.mjs");
  if (!server.listening) await once(server, "listening");
  t.after(() => new Promise(resolve => server.close(resolve)));

  const [pageResponse, scriptResponse] = await Promise.all([
    fetch(`http://127.0.0.1:${port}/`),
    fetch(`http://127.0.0.1:${port}/app.js`)
  ]);

  assert.equal(pageResponse.status, 200);
  assert.equal(scriptResponse.status, 200);
  assert.match(await pageResponse.text(), /<title>Project Glassbox/);
  assert.match(await scriptResponse.text(), /GlassboxAgentAdapter/);
});
