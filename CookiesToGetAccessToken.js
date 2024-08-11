const axios = require('axios');
const cheerio = require('cheerio');

async function getAccessToken(cookie) {
    if (!cookie) {
        console.error('error: 404');
        return;
    }

    try {
        const url = 'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed';
        const response = await axios.get(url, {
            headers: {
                'Connection': 'keep-alive',
                'Keep-Alive': '300',
                'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
                'Accept-Language': 'en-us,en;q=0.5',
                'User-Agent': 'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14',
                'Cookie': cookie
            },
            timeout: 60000
        });

        const pageContent = response.data;
        const token = extractAccessToken(pageContent);

        if (!token) {
            console.error('cookie die');
        } else {
            console.log(token);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function extractAccessToken(content) {
    const $ = cheerio.load(content);
    const match = content.match(/accessToken":"([^"]+)"/);
    return match ? match[1] : null;
}

// Example usage
const cookie = 'FB Cookies';
getAccessToken(cookie);
