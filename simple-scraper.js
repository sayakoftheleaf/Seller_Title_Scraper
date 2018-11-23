const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const util = require ('util');

let readFilePromiseified = util.promisify(fs.readFile);

async function main(){
    let data = await readFilePromiseified('./AmazonSeller.csv');

    let dataArr = String(data).split('\n');

    let urlArr = dataArr.map(x => `https://www.amazon.com/sp?_encoding=UTF8&asin=&isAmazonFulfilled=&isCBA=&marketplaceID=ATVPDKIKX0DER&orderID=&seller=${x}&tab=&vasStoreID=`);

    let titleArr = [];
    
    for (let i = 0; i < urlArr.length; i++) {
        titleArr[i] = `${dataArr[i]}, ${await mapper(urlArr[i])}`;
        //eslint-disable-next-line no-console
        console.log(titleArr[i]);
    }
}

async function mapper (someURL) {
    let options = {
        uri: someURL,
        transform: (body) => cheerio.load(body)
    };

    let $ = await rp(options);
    return $('#sellerName').text();
}

main();
