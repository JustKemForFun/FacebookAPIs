const axios = require('axios');

async function checkFacebookAccount(uid) {
    const url = `https://graph2.facebook.com/v3.3/${uid}/picture?redirect=0`;

    try {
        const response = await axios.get(url);
        const httpCode = response.status;

        if (httpCode === 200) {
            const data = response.data;

            if (data.data && data.data.url && data.data.url !== 'https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/UlIqmHJn-SK.gif') {
                console.log(`ID is: ${uid} live.`);
            } else {
                console.log(`ID is: ${uid} died.`);
            }
        } else {
            console.log(`Error ${uid}.`);
        }
    } catch (error) {
        console.error(`Error checking account for ID ${uid}: ${error.message}`);
    }
}

// Replace with actual Facebook user ID
const uid = 'User id'; // kemsadboiz
checkFacebookAccount(uid);
