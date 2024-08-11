const axios = require('axios');

/**
 * Like and follow a Facebook page
 * @param {string} pageId - The ID of the page to like and follow
 * @param {string} actorId - The ID of the main profile
 * @param {string} token - The access token
 * @returns {Promise<void>}
 */
async function likeAndFollowPage(pageId, actorId, token) {
    const postFields = {
        method: 'POST',
        pretty: 'false',
        format: 'json',
        server_timestamps: 'true',
        locale: 'en_US',
        fb_api_req_friendly_name: 'PageLike',
        fb_api_caller_class: 'graphservice',
        client_doc_id: '92246462512975232024543564417',
        variables: JSON.stringify({
            input: {
                source: 'page_profile',
                client_mutation_id: 'd390bd05-c6f5-45e2-87c4-824f2425bc94',
                page_id: pageId,
                actor_id: actorId
            }
        }),
        fb_api_analytics_tags: JSON.stringify([
            'nav_attribution_id={"0":{"bookmark_id":"986244814899307","session":"","subsession":0,"timestamp":"1706298676.534","tap_point":"logout","most_recent_tap_point":"logout","bookmark_type_name":null,"fallback":false}}',
            'visitation_id=250100865708545:aea40:1:1706298471.122',
            'GraphServices'
        ]),
        client_trace_id: '12c7948e-6d1b-407e-b092-1f0721705ad7'
    };

    try {
        const response = await axios.post('https://graph.facebook.com/graphql', new URLSearchParams(postFields), {
            headers: {
                'Authorization': `OAuth ${token}`,
                'User-Agent': '[FBAN/FB4A;FBAV/417.0.0.33.65;FBBV/480086274;FBDM/{density=1.5,width=720,height=1244};FBLC/en_US;FBRV/0;FBCR/T-Mobile;FBMF/samsung;FBBD/samsung;FBPN/com.facebook.katana;FBDV/SM-N976N;FBSV/7.1.2;FBOP/1;FBCA/x86:armeabi-v7a;]',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-fb-request-analytics-tags': '{"network_tags":{"product":"350685531728","purpose":"none","request_category":"graphql","retry_attempt":"0"},"application_tags":"graphservice"}',
                'x-fb-ta-logging-ids': 'graphql:12c7948e-6d1b-407e-b092-1f0721705ad7',
                'x-fb-sim-hni': '31016',
                'x-fb-net-hni': '31016'
            }
        });

        const data = response.data;
        if (data.data.page_like.page.does_viewer_like) {
            console.log('Success: Page liked and followed successfully!');
        } else {
            console.log('Error: Failed to like and follow page!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
const pageId = 'PAGE_ID_HERE';
const actorId = 'ACTOR_ID_HERE';
const token = 'ACCESS_TOKEN_HERE';
likeAndFollowPage(pageId, actorId, token);
