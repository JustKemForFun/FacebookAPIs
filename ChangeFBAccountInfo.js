const axios = require('axios');

class ChangeInfo {
    constructor(token) {
        this._token = token;

        // Check Node.js version
        if (process.versions.node < '14.0.0') {
            throw new Error('Script requires Node.js version 14.0 or higher');
        }

        this._debugHelper(true);

        this._cURL(`https://graph.facebook.com/me?fields=id&method=get&access_token=${token}`)
            .then(response => {
                const check = this.jsonDecode(response.data);
                if (!check.id) {
                    throw new Error('Failed to validate Access Token. Please try again.');
                }
            })
            .catch(error => {
                throw new Error(`Failed to validate Access Token: ${error.message}`);
            });
    }

    _debugHelper(enable = false) {
        if (enable) {
            console.error = console.log;
        }
    }

    buildInfoData(array_works = null, array_educations = null, array_locations = null, array_hometowns = null) {
        const list_works = '199335430228364,1449882825259646,404364316299372,364266503653396,284441914994985,150432771833857,273585562717263,186526491412477,491718167601112,160889070755690,455136817892832,278691522172298,394673770605082,193736914113469,303815509698891,527939503885072,589469711073338,439576109404073,172634796203930,392841364163208,380352878715697,178710288859092,396969850363495,324293407660845,149685271884873,411805008910319,220837428048496,393325970743478,229059833870833,604549982992424,265697196972715,608264482550784,1508953502658167,243592189055788,590839780932535,328128390614827,169473469803136,1431668743715490,410931079014774,804915459547988,302347599941122,1355523107920366,1524047434479238,176576215846923,132880673583705,611621508906484,432441956850935,299122373470263,516287901797023,297887053691759,341353432659545,821302657904029,1419126244967888,458183870922920,828361847176158,246327162213574,287355684764752,296237853911209,456162307852351,246058735465989,114486425230945,339291512808574,313839781999286,595128230497694,228574320666013,350598698394883,588286127928525,420350851410929,437220633088417,1436698343210538,107069715994723,203102629411,1374453576167497,175824552550885,442921555753826,649829715124781,742312892455086,298656160270365,373402429430776,140755475944662,401351536626572,111558409008965,476253729122161,218452775030979,735899406434068,1378775712343103,106855639353150,503780313014468,336276036541065,491164747657734,343220645802963,167254893411299,148701341990612,366760276762280,325622440933354,223370504492468,366206566847559,295601970639781,225237857603960,1651344311757493,178998485518224,235547613319022,576797812412550,1444652822427029,161884933978575,174007909416087,282103828647892,664179060284345,525699184140672,648765911886631,175118999981,1374568959470237,608201065858192,212817775547341,317089548345594,617058111643894,1417536901856386,518834961507053,301971153281646,578525178833483';
        const array_worksList = list_works.split(',');

        const list_educations = '268387536637911,269148299953203,320221031488908,466915453326832,174023552741246,561753180651550,150575504972171,175500062536618,365835643475448,149464781750421,145408438926727,371076729603250,257361634299656,165591340201548,1482018725390986,109023919492786,1470000549928843,531368213599780,1480144678891608,269148299953203,1447166342200275,264582483920424,1268145033245905,192478990904584';
        const array_educationsList = list_educations.split(',');

        const list_locations = '108458769184495,106388046062960,103934556308311,114668461883395,106324046073002,105067312862855,109386409085521,110457042313059,108663225822794,111615515528234,111069018917944,109205905763791,351759091676222,109226295764303,107446829285335,109022329119710';
        const array_locationsList = list_locations.split(',');

        const list_hometowns = '108458769184495,106388046062960,103934556308311,114668461883395,106324046073002,105067312862855,109386409085521,110457042313059,108663225822794,111615515528234,111069018917944,109205905763791,351759091676222,109226295764303,107446829285335,109022329119710';
        const array_hometownsList = list_hometowns.split(',');

        const work = [
            {
                id: array_worksList[Math.floor(Math.random() * array_worksList.length)],
                privacy: { value: "EVERYONE" },
                ref: "nux_android"
            }
        ];

        const education = [
            {
                id: array_educationsList[Math.floor(Math.random() * array_educationsList.length)],
                privacy: { value: "EVERYONE" },
                ref: "nux_android",
                type: "College"
            }
        ];

        const location = {
            id: array_locationsList[Math.floor(Math.random() * array_locationsList.length)],
            privacy: { value: "EVERYONE" },
            ref: "nux_android"
        };

        const hometown = {
            id: array_hometownsList[Math.floor(Math.random() * array_hometownsList.length)],
            privacy: { value: "EVERYONE" },
            ref: "nux_android"
        };

        const w = encodeURIComponent(this.jsonEncode(work));
        const e = encodeURIComponent(this.jsonEncode(education));
        const l = encodeURIComponent(this.jsonEncode(location));
        const h = encodeURIComponent(this.jsonEncode(hometown));

        return [w, e, l, h];
    }

    async setInfo(data) {
        const url = `https://graph.facebook.com/me?locale=vi_VN&client_country_code=VN&fb_api_req_friendly_name=save_core_profile_info&access_token=${this._token}&work=${data[0]}&education=${data[1]}&location=${data[2]}&hometown=${data[3]}&method=post`;
        await this._cURL(url);
    }

    async setPublicPhoto(type = 'avatar', imgLink = null, caption = '<3') {
        if (imgLink) {
            const preUp = await this._cURL(`https://graph.facebook.com/me/photos?access_token=${this._token}&caption=${encodeURIComponent(caption)}&url=${encodeURIComponent(imgLink)}&method=post`);
            const preUpData = this.jsonDecode(preUp.data);

            if (type === 'avatar') {
                await this._cURL(`https://graph.facebook.com/me/picture?access_token=${this._token}&photo=${preUpData.id}&method=post&caption=${encodeURIComponent(caption)}&width=500&height=500`);
            } else {
                await this._cURL(`https://graph.facebook.com/me/cover?access_token=${this._token}&photo=${preUpData.id}&method=post&caption=${encodeURIComponent(caption)}&width=500&height=500`);
            }
        }
    }

    jsonEncode(data) {
        return JSON.stringify(data);
    }

    jsonDecode(data) {
        return JSON.parse(data);
    }

    async _cURL(url) {
        try {
            const response = await axios.get(url, {
                validateStatus: () => true,
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error(`Error making request to ${url}: ${error.message}`);
            throw error;
        }
    }

    async execute(additionalParameters = null) {
        await this.setInfo(this.buildInfoData());
        await this.setPublicPhoto('avatar');
        await this.setPublicPhoto('cover');
    }
}

// Usage
const token = 'here is your fb access token';
(async () => {
    try {
        const change = new ChangeInfo(token);
        await change.execute();
    } catch (error) {
        console.error(error.message);
    }
})();
