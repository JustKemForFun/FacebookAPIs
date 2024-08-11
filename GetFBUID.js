const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Get Facebook profile or page ID
 * @param {string} url - The URL of the Facebook profile or page
 * @returns {Promise<string>} - The ID of the Facebook profile or page
 */
async function getFBID(url) {
    try {
        const name = url.substring(url.lastIndexOf('/') + 1);
        const response = await axios.get(`https://m.facebook.com/${name}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5'
            }
        });

        const $ = cheerio.load(response.data);
        let match = '';

        // const entityIdMatch = response.data.match(/entity_id:(.+?)}]]/);
        const entityIdMatch = $.match(/entity_id:(.+?)}]]/);
        if (entityIdMatch) {
            match += entityIdMatch[1];
        }

        // const metaTagMatch = response.data.match(/<meta property="al:android:url" content="fb:\/\/profile\/(.+?)"/);
        const metaTagMatch = $.match(/<meta property="al:android:url" content="fb:\/\/profile\/(.+?)"/);
        if (metaTagMatch) {
            match += metaTagMatch[1];
        }

        return match;
    } catch (error) {
        console.error('Error:', error.message);
        return '';
    }
}

// Example usage
getFBID('https://www.facebook.com/kemsadboiz').then(id => {
    console.log('ID:', id);
});
