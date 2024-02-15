const http = require("http");
const fs = require("fs");
const path = require("path");
const { todosDataPath } = require("./database");

const hostname = "localhost";
const port = 3000;

function createHttpServer() {
  const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
      serveHomePage(res);
    } else if (req.url === "/astronomy" && req.method === "GET") {
      serveAstronomyPage(res);
    } else if (req.url === "/astronomy/image" && req.method === "GET") {
      serveStaticFile(res, path.join(__dirname, "public", "images", "astronomy_image.jpg"), "image/jpeg");
    } else {
      serve404Page(res);
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

function serveHomePage(res) {
  res.setHeader("Content-Type", "text/html");

  const todosStream = fs.createReadStream(todosDataPath, "utf-8");  

  res.write(`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/home-style.css">
  <title>Home Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</head>
<body class = "bg-dark text-light">
  <h1>TODO List</h1>
  <ol class="list-group list-group-numbered">
`);

  todosStream.on("data", (chunk) => {
    const todos = JSON.parse(chunk);
    todos.forEach((todo) => {
      res.write(`<li class="list-group-item">${todo.title}</li>`);
    });
  });

  todosStream.on("end", () => {
    res.write(`</ol>
</body>
</html>`);
    res.end();
  });
}

function serveAstronomyPage(res) {
  res.setHeader("Content-Type", "text/html");

  const imgSrc = "/astronomy/image";

  res.write(`<!DOCTYPE html>
<html>
<head>
  <title>Astronomy Page</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class = "bg-dark text-light">
  <h1>Astronomy Page</h1>
  <img src="${imgSrc}" alt="Astronomy Image">
  <p>Wadi El Hitan, known as the Valley of Whales, is home to the unique Fossils and Climate Change Museum</p>
</body>
</html>`);
  res.end();
}

function serveStaticFile(res, filePath, contentType) {
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('error', (err) => {
    console.error(`Error reading file ${filePath}:`, err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });

  res.writeHead(200, { 'Content-Type': contentType });
  fileStream.pipe(res);
}

function serve404Page(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");

  const notFoundPagePath = path.join(__dirname, "public", "404", "index.html");
  serveStaticFile(res, notFoundPagePath, "text/html");
}

module.exports = createHttpServer;
