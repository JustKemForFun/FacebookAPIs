const axios = require('axios');
const cheerio = require('cheerio');

async function fetchUrlData(url) {
    const response = {
        success: false,
        message: '',
        id: '',
        title: '',
        links: {}
    };

    try {
        if (!url) {
            throw new Error('Vui lòng cung cấp URL');
        }

        const headers = {
            'sec-fetch-user': '?1',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-site': 'none',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'cache-control': 'max-age=0',
            'authority': 'www.facebook.com',
            'upgrade-insecure-requests': '1',
            'accept-language': 'en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6',
            'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        };

        const { data } = await axios.get(url, { headers });

        response.success = true;
        response.id = generateId(url);
        response.title = getTitle(data);

        const sdLink = getSDLink(data);
        if (sdLink) {
            response.links['Tải về chất lượng thấp'] = sdLink + '&dl=1';
        }

        const hdLink = getHDLink(data);
        if (hdLink) {
            response.links['Tải về chất lượng cao'] = hdLink + '&dl=1';
        }
    } catch (error) {
        response.success = false;
        response.message = error.message;
    }

    return response;
}

function generateId(url) {
    let id = '';
    if (/^\d+$/.test(url)) {
        id = url;
    } else {
        const match = url.match(/(\d+)\/?$/);
        if (match) {
            id = match[1];
        }
    }
    return id;
}

function cleanStr(str) {
    return JSON.parse(`{"text": "${str}"}`).text;
}

function getSDLink(html) {
    const $ = cheerio.load(html);
    const sdLink = $('script:contains("browser_native_sd_url")').text().match(/browser_native_sd_url":"([^"]+)"/);
    return sdLink ? cleanStr(sdLink[1]) : false;
}

function getHDLink(html) {
    const $ = cheerio.load(html);
    const hdLink = $('script:contains("browser_native_hd_url")').text().match(/browser_native_hd_url":"([^"]+)"/);
    return hdLink ? cleanStr(hdLink[1]) : false;
}

function getTitle(html) {
    const $ = cheerio.load(html);
    let title = $('title').text();
    if (!title) {
        title = $('meta[property="og:title"]').attr('content') || '';
    }
    return cleanStr(title);
}

// Example usage
const url = 'your_url_here';  // Replace with actual URL
fetchUrlData(url).then(result => {
    console.log(JSON.stringify(result, null, 2));
});
