const axios = require('axios');

const token = 'Access-token'; 

async function getAllPages() {
    const url = 'https://graph.facebook.com/graphql';
    const postFields = {
        method: 'POST',
        pretty: 'false',
        format: 'json',
        server_timestamps: 'true',
        locale: 'en_US',
        purpose: 'fetch',
        fb_api_req_friendly_name: 'NativeTemplateScreenQuery',
        fb_api_caller_class: 'graphservice',
        client_doc_id: '221080835213847099052419048024',
        variables: JSON.stringify({
            params: {
                path: '/pages/nt_launchpoint_redesign/homescreen/',
                nt_context: {
                    styles_id: 'e6c6f61b7a86cdf3fa2eaaffa982fbd1',
                    using_white_navbar: true,
                    pixel_ratio: 1.5,
                    is_push_on: true,
                    bloks_version: 'c3cc18230235472b54176a5922f9b91d291342c3a276e2644dbdb9760b96deec'
                },
                params: '{"ref":"bookmark"}',
                extra_client_data: {}
            },
            scale: '1.5',
            nt_context: {
                styles_id: 'e6c6f61b7a86cdf3fa2eaaffa982fbd1',
                using_white_navbar: true,
                pixel_ratio: 1.5,
                is_push_on: true,
                bloks_version: 'c3cc18230235472b54176a5922f9b91d291342c3a276e2644dbdb9760b96deec'
            }
        }),
        fb_api_analytics_tags: '["GraphServices"]',
        client_trace_id: 'c0616f50-e1da-4dd2-a366-10d5d3c5161a'
    };

    try {
        const response = await axios.post(url, new URLSearchParams(postFields), {
            headers: {
                'x-fb-request-analytics-tags': '{"network_tags":{"product":"350685531728","purpose":"fetch","request_category":"graphql","retry_attempt":"0"},"application_tags":"graphservice"}',
                'x-fb-ta-logging-ids': 'graphql:c0616f50-e1da-4dd2-a366-10d5d3c5161a',
                'x-fb-rmd': 'state=URL_ELIGIBLE',
                'x-fb-sim-hni': '31016',
                'x-fb-net-hni': '31016',
                'Authorization': `OAuth ${token}`,
                'x-graphql-request-purpose': 'fetch',
                'User-Agent': '[FBAN/FB4A;FBAV/417.0.0.33.65;FBBV/480086274;FBDM/{density=1.5,width=720,height=1244};FBLC/en_US;FBRV/0;FBCR/T-Mobile;FBMF/samsung;FBBD/samsung;FBPN/com.facebook.katana;FBDV/SM-N976N;FBSV/7.1.2;FBOP/1;FBCA/x86:armeabi-v7a;]',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-fb-connection-type': 'WIFI',
                'x-fb-background-state': '1',
                'x-fb-qpl-ec': 'uid=f70b2f3a-5175-4bf9-ae06-e9907f1ae547',
                'x-fb-friendly-name': 'NativeTemplateScreenQuery',
                'x-graphql-client-library': 'graphservice',
                'Content-Encoding': '',
                'x-fb-device-group': '3543',
                'x-tigon-is-retry': 'False',
                'Priority': 'u=3,i',
                'Accept-Encoding': '',
                'x-fb-http-engine': 'Liger',
                'x-fb-client-ip': 'True',
                'x-fb-server-cluster': 'True'
            }
        });

        const data = response.data.data.native_template_screen.nt_bundle.nt_bundle_attributes;
        data.forEach(d => {
            if (d.profile_switcher_eligible_profile) {
                const pData = d.profile_switcher_eligible_profile;
                const token = pData.session_info.access_token;
                const profileId = pData.profile.id;
                const profileName = pData.profile.name;
                const profileUri = pData.profile.profile_picture.uri;

                console.log(`Token: ${token}`);
                console.log(`ID: ${profileId}`);
                console.log(`Name: ${profileName}`);
                console.log(`Pic: ${profileUri}`);
                console.log('---');
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
getAllPages();
