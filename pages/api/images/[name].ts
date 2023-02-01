export const config = {
  api: { externalResolver: true },
};

import express from "express";
const handler = express();

const serveFiles = express.static("/tmp/leet-coworkers/out");
handler.use(["/api/images"], serveFiles);

export default handler;
