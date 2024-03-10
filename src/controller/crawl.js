const crawler = require("../utils/webCrawler");
module.exports = async function (req, res) {
	try {
		const url = req.body.url;
		const result = await crawler(url);
		return res.status(200).json(result);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err?.message);
	}
};
