const http = require("http");

const https = require("https");

const fs = require("fs");

const url = require("url");

const { StringDecoder } = require("string_decoder");

const config = require("./config");

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(
    `Sever listening on ${config.httpPort} in ${config.envName} environment`
  );
});

const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/certificate.pem"),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(
    `Sever listening on ${config.httpsPort} in ${config.envName} environment`
  );
});

const unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  const queryStringObject = parsedUrl.query;

  const method = req.method.toLowerCase();

  const headers = req.headers;

  const decoder = new StringDecoder("utf8");

  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      payload = typeof payload == "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");

      res.writeHead(statusCode);

      res.end(payloadString);

      console.log(
        `status code of: ${statusCode} and payload: ${payloadString}`
      );
    });
  });
};

const handlers = {};

handlers.sample = (data, cb) => {
  cb(406, data);
};

handlers.notFound = (data, cb) => {
  cb(404);
};

const router = {
  sample: handlers.sample,
};
