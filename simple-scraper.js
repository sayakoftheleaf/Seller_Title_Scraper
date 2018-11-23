const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const util = require ('util');

let readFilePromiseified = util.promisify(fs.readFile);

const newData = `A1ZLB4YH32IG4K
AD3C6KQVZUT23
AWKA0KIJDUVYN
A3OJQJ1JZFURQV
A2I5MH2FQVL8A9`;

async function main(){
    // let data = await readFilePromiseified('./AmazonSeller.csv');

    // let dataArr = String(data).split('\n');
    let dataArr = newData.split('\n');

    let urlArr = dataArr.map(x => `https://www.amazon.com/sp?_encoding=UTF8&asin=&isAmazonFulfilled=&isCBA=&marketplaceID=ATVPDKIKX0DER&orderID=&seller=${x}&tab=&vasStoreID=`);

    let titleArr = [];
    
    for (let i = 0; i < urlArr.length; i++) {
        let name = await mapper(urlArr[i]);
        name = name.replace(/'/g, '\\\'');
        
        titleArr[i] = `('${dataArr[i]}','${name}'),`;

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
