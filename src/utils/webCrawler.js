// const puppeteer = require("puppeteer")
module.exports = async function(url){
    const title = "dummy Title";
    const description = "lorem ipsum doir sit lorem ipsum doir sit";
    const thumbnail = "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";

    /*
    do the web scraping
    store the result into title, description, thumbnail 
    */

    return {
        title,
        description,
        thumbnail
    }
}