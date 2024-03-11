const puppeteer = require("puppeteer");

module.exports = async function (url) {
	const metaData = {
		url,
		title: "",
		description: "",
		domain: "",
		icon: "",
		thumbnail: "",
	};

	// scrape the content
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: false,
		userDataDir: "./tmp",
	});
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });

	// extract title
	metaData.title = await tryFetch(async () => await page.title());

	// extract domain
	metaData.domain = await tryFetch(async () => {
		const domainURL = new URL(page.url()).hostname;
		if (domainURL.startsWith("www.")) {
			domainURL.substring(4);
		}
		return domainURL;
	});

	// extract favicon href
	metaData.icon =
		(await tryFetch(
			async () => await page.$eval('link[rel*="icon"]', (link) => link.href)
		)) ||
		(await tryFetch(async () => {
			const res = (await fetch(url + "/favicon.ico")).text();
			if (res) {
				metaData.icon = url + "/favicon.ico";
			} else {
				metaData.icon = "";
			}
		}));

	// description
	metaData.description =
		(await tryFetch(
			async () =>
				await page.$eval(
					'meta[property="og:description"]',
					(metaTag) => metaTag.content
				)
		)) ||
		(await tryFetch(
			async () =>
				await page.$eval('meta[name="description"]', (metaTag) => metaTag.content)
		)) ||
		(await tryFetch(
			async () =>
				await page.$eval(
					'meta[name="twitter:description"',
					(metaTag) => metaTag.content
				)
		));
	metaData.description = await tryFetch(
		async () => metaData.description.split(".")[0]
	);

	// thumbail
	metaData.thumbnail =
		(await tryFetch(
			async () =>
				await page.$eval('meta[property="og:image"]', (metaTag) => metaTag.content)
		)) ||
		(await tryFetch(
			async () =>
				await page.$eval('meta[name="twitter:image"]', (metaTag) => metaTag.content)
		)) ||
		(await tryFetch(async () => {
			const pageContentImages = await page.$$eval("img", (imageTags) =>
				imageTags.map((img) => img.src)
			);
			return pageContentImages.length > 0 ? pageContentImages[0] : "";
		}));

	await browser.close();
	return metaData;
};

async function tryFetch(cb) {
	try {
		const value = await cb();
		return value;
	} catch (err) {
		return "";
	}
}
