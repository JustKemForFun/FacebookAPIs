const crypto = require('crypto');
const axios = require('axios');

// Configurations
const app = {
  api_key: '882a8490361da98702bf97a021ddc14d',
  secret: '62f8ce9f74b12f84c123cc23437a4a32'
};

const email_prefix = [
  'gmail.com',
  'hotmail.com',
  'yahoo.com',
  'live.com',
  'rocket.com',
  'outlook.com'
];

const names = {
  first: ['JAMES', 'JOHN', 'ROBERT', 'MICHAEL', 'WILLIAM', 'DAVID'],
  last: ['SMITH', 'JOHNSON', 'WILLIAMS', 'BROWN', 'JONES', 'MILLER'],
  mid: ['Alexander', 'Anthony', 'Charles', 'Dash', 'David', 'Edward']
};

// Utility functions
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomDate() {
  const start = new Date('1980-01-01');
  const end = new Date('1995-12-30');
  return getRandomDate(start, end).toISOString().split('T')[0];
}

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').toUpperCase();
}

function md5Hash(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

// Generate data
const randomBirthDay = generateRandomDate();
const randomFirstName = names.first[Math.floor(Math.random() * names.first.length)];
const randomName = names.mid[Math.floor(Math.random() * names.mid.length)] + ' ' + names.last[Math.floor(Math.random() * names.last.length)];
const password = 'PAss' + Math.floor(Math.random() * 10000000) + '?#@';
const fullName = randomFirstName + ' ' + randomName;
const md5Time = md5Hash(Date.now().toString());

// Create hash with substring method
const hash = [
  md5Time.substring(0, 8),
  md5Time.substring(8, 12),
  md5Time.substring(12, 16),
  md5Time.substring(16, 20),
  md5Time.substring(20)
].join('-');

const emailRand = (fullName.replace(/ /g, '').toLowerCase() + md5Hash(Date.now().toString() + new Date().toISOString().split('T')[0]).substring(0, 6) + '@' + email_prefix[Math.floor(Math.random() * email_prefix.length)]);
const gender = Math.random() > 0.5 ? 'M' : 'F';

const req = {
  api_key: app.api_key,
  attempt_login: true,
  birthday: randomBirthDay,
  client_country_code: 'EN',
  fb_api_caller_class: 'com.facebook.registration.protocol.RegisterAccountMethod',
  fb_api_req_friendly_name: 'registerAccount',
  firstname: randomFirstName,
  format: 'json',
  gender: gender,
  lastname: randomName,
  email: emailRand,
  locale: 'en_US',
  method: 'user.register',
  password: password,
  reg_instance: hash,
  return_multiple_errors: true
};

// Sort the request object and create the signature
const sortedKeys = Object.keys(req).sort();
let sig = '';
for (const key of sortedKeys) {
  sig += key + '=' + req[key];
}
const ensig = md5Hash(sig + app.secret);

req.sig = ensig;

const api = 'https://b-api.facebook.com/method/user.register';
axios.post(api, req, {
  headers: {
    'User-Agent': '[FBAN/FB4A;FBAV/35.0.0.48.273;FBDM/{density=1.33125,width=800,height=1205};FBLC/en_US;FBCR/;FBPN/com.facebook.katana;FBDV/Nexus 7;FBSV/4.1.1;FBBK/0;]'
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
