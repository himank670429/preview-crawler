const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 4000;

app.use(require("cors")());
app.use(express.json());

const crawl = require('./controller/crawl');

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
	res.sendFile("./index.html");
});

app.post("/crawl", crawl);

app.listen(port, () => console.log(`http://localhost:${port}`));
