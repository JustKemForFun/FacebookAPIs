const crypto = require('crypto');
const NodeRSA = require('node-rsa');

class PasswordEncryptor {
    constructor(pubkeyBytes, keyId) {
        this.pubkeyBytes = pubkeyBytes;
        this.keyId = keyId;
    }

    encryptPassword(password) {
        const randKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);

        const key = new NodeRSA(this.pubkeyBytes);
        const encryptedRandKey = key.encrypt(randKey, 'buffer');

        const cipher = crypto.createCipheriv('aes-256-gcm', randKey, iv);
        let cipherText = cipher.update(password, 'utf8', 'binary');
        cipherText += cipher.final('binary');
        const authTag = cipher.getAuthTag();

        const buf = Buffer.concat([
            Buffer.from([0x01]),
            Buffer.from([(this.keyId >> 8) & 0xFF, this.keyId & 0xFF]),
            iv,
            Buffer.from([(encryptedRandKey.length >> 8) & 0xFF, encryptedRandKey.length & 0xFF]),
            encryptedRandKey,
            authTag,
            Buffer.from(cipherText, 'binary')
        ]);

        const encoded = buf.toString('base64');
        return `#PWD_FB4A:2:${Math.floor(Date.now() / 1000)}:${encoded}`;
    }
}

// Dữ liệu đầu vào
const pubkeyBytes = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbd8VjAw2abyJ4eFWRtK
T7sI0UGmHRLtAtsp0tCI3yXxA5V4xEhLlc2SCXWpHxmjFuQ5vh37JyVQZLDxB5Vc
LPa1S8Lqsk0WfMnSEi5r5dpxThIF77JpJ9J9/L7oh1IGCFpsYQyQCXxOuXQd8XX4
YJV5aShUDtwLOMBgaqkGj5QHpNBGHMqewjwXUHMrh0FFFskEzQUkhzNEme7ogdvf
yvRwXvvJFZvp00XXnkTUMhmKa1UmhL0haqlXrGd1WfOs2WnAp6iJtIkKSCZSpPib
jIdS4VUhrCzUkjr+mvbRPO2Isz8JT80BL2pD2ob6Z5W9s/qcfquNqxNlvCP6u5qx
vwIDAQAB
-----END PUBLIC KEY-----`;
const keyId = 230;

// Khởi tạo và mã hóa mật khẩu
const encryptor = new PasswordEncryptor(pubkeyBytes, keyId);
const encryptedPassword = encryptor.encryptPassword('mishu444');

console.log(encryptedPassword);

/*
function encrypt($password, $publicKey, $keyId)
{
		$time = time();
		$session_key = random_bytes(32);
		$iv = random_bytes(12);
		$tag= '';
		$rsa = new RSA();
		
		$rsa->loadKey($publicKey); 
		$rsa->setSignatureMode(RSA::SIGNATURE_PKCS1);
		$enc_session_key = $rsa->encrypt($session_key);
        $encrypted = openssl_encrypt( $password,'aes-256-gcm',$session_key,OPENSSL_RAW_DATA,$iv,$tag,intVal($time));
		
		return "#PWD_FB4A:2:".$time.":".base64_encode(("\x01" . pack('n', intval($keyId)) .$iv. pack('n',strlen($enc_session_key) ) . $enc_session_key . $tag . $encrypted));
}

$p = "mishu444";
$publicKey = "-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbd8VjAw2abyJ4eFWRtK
T7sI0UGmHRLtAtsp0tCI3yXxA5V4xEhLlc2SCXWpHxmjFuQ5vh37JyVQZLDxB5Vc
LPa1S8Lqsk0WfMnSEi5r5dpxThIF77JpJ9J9/L7oh1IGCFpsYQyQCXxOuXQd8XX4
YJV5aShUDtwLOMBgaqkGj5QHpNBGHMqewjwXUHMrh0FFFskEzQUkhzNEme7ogdvf
yvRwXvvJFZvp00XXnkTUMhmKa1UmhL0haqlXrGd1WfOs2WnAp6iJtIkKSCZSpPib
jIdS4VUhrCzUkjr+mvbRPO2Isz8JT80BL2pD2ob6Z5W9s/qcfquNqxNlvCP6u5qx
vwIDAQAB
-----END PUBLIC KEY-----";

$keyId     = 230;

//$enc_pass = urlencode(encrypt($p, $publicKey, $keyId));
$enc_pass = encrypt($p, $publicKey, $keyId);

echo $enc_pass;
*/
