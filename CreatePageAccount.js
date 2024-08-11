const axios = require('axios');
const querystring = require('querystring');

async function createFacebookPage(token, fullName) {
    const postFields = {
        method: 'POST',
        pretty: 'false',
        format: 'json',
        server_timestamps: 'true',
        locale: 'en_US',
        purpose: 'fetch',
        fb_api_req_friendly_name: 'FbBloksActionRootQuery-com.bloks.www.additional.profile.plus.creation.action.category.submit',
        fb_api_caller_class: 'graphservice',
        client_doc_id: '11994080423068421059028841356',
        variables: JSON.stringify({
            params: JSON.stringify({
                client_input_params: {
                    cp_upsell_declined: 0,
                    category_ids: ["2214"],
                    profile_plus_id: "0",
                    page_id: "0"
                },
                server_params: {
                    INTERNAL__latency_qpl_instance_id: 40168896100127,
                    screen: "category",
                    referrer: "pages_tab_launch_point",
                    name: fullName,
                    creation_source: "android",
                    INTERNAL__latency_qpl_marker_id: 36707139,
                    variant: 5
                }
            }),
            bloks_versioning_id: "c3cc18230235472b54176a5922f9b91d291342c3a276e2644dbdb9760b96deec",
            app_id: "com.bloks.www.additional.profile.plus.creation.action.category.submit"
        }),
        scale: "1.5",
        nt_context: JSON.stringify({
            styles_id: "e6c6f61b7a86cdf3fa2eaaffa982fbd1",
            using_white_navbar: true,
            pixel_ratio: 1.5,
            is_push_on: true,
            bloks_version: "c3cc18230235472b54176a5922f9b91d291342c3a276e2644dbdb9760b96deec"
        })
    };

    const headers = {
        'x-fb-request-analytics-tags': JSON.stringify({
            network_tags: {
                product: "350685531728",
                purpose: "fetch",
                request_category: "graphql",
                retry_attempt: "0"
            },
            application_tags: "graphservice"
        }),
        'x-fb-ta-logging-ids': 'graphql:da784ac0-b476-4316-9335-34672eddf94c',
        'x-fb-rmd': 'state=URL_ELIGIBLE',
        'x-fb-sim-hni': '31016',
        'x-fb-net-hni': '31016',
        'authorization': `OAuth ${token}`,
        'x-graphql-request-purpose': 'fetch',
        'user-agent': '[FBAN/FB4A;FBAV/417.0.0.33.65;FBBV/480086274;FBDM/{density=1.5,width=720,height=1244};FBLC/en_US;FBRV/0;FBCR/T-Mobile;FBMF/samsung;FBBD/samsung;FBPN/com.facebook.katana;FBDV/SM-N976N;FBSV/7.1.2;FBOP/1;FBCA/x86:armeabi-v7a;]',
        'content-type': 'application/x-www-form-urlencoded',
        'x-fb-connection-type': 'WIFI',
        'x-fb-background-state': '1',
        'x-fb-friendly-name': 'FbBloksActionRootQuery-com.bloks.www.additional.profile.plus.creation.action.category.submit',
        'x-graphql-client-library': 'graphservice',
        'x-fb-privacy-context': '3643298472347298',
        'content-encoding': '',
        'x-fb-device-group': '3543',
        'x-tigon-is-retry': 'False',
        'priority': 'u=3,i',
        'accept-encoding': '',
        'x-fb-http-engine': 'Liger',
        'x-fb-client-ip': 'True',
        'x-fb-server-cluster': 'True'
    };

    try {
        const response = await axios.post('https://graph.facebook.com/graphql', querystring.stringify(postFields), { headers });
        const successRes = response.data.data.fb_bloks_action.root_action.action.action_bundle.bloks_bundle_action;

        if (successRes.includes('Cannot create Page: You have created too many Pages in a short time. Please try later.')) {
            console.log(`Failed to create page!<br>${successRes}`);
        } else {
            console.log('Page created successfully!');
        }
    } catch (error) {
        console.error(`Error creating page: ${error.message}`);
    }
}

// Replace with your actual access token and page name
const token = 'Access_token';
const fullName = 'Page Name';
createFacebookPage(token, fullName);
