const crypto = require('crypto');
const bigInt = require('big-integer');

class Hash {
    static MODE_INTERNAL = 1;
    static MODE_MHASH = 2; // Not directly applicable in Node.js, kept for consistency.
    static MODE_HASH = 3;

    constructor(hash = 'sha1') {
        if (!global.CRYPT_HASH_MODE) {
            if (crypto.getHashes().includes(hash)) {
                global.CRYPT_HASH_MODE = Hash.MODE_HASH;
            } else {
                global.CRYPT_HASH_MODE = Hash.MODE_INTERNAL;
            }
        }

        this.setHash(hash);
    }

    setKey(key = false) {
        this.key = key;
        this._computeKey();
    }

    _computeKey() {
        if (!this.key) {
            this.computedKey = null;
            return;
        }

        if (this.key.length <= this.b) {
            this.computedKey = this.key;
        } else {
            if (this.engine === Hash.MODE_HASH) {
                this.computedKey = crypto.createHash(this.hash).update(this.key).digest();
            } else {
                this.computedKey = this.hashFunction(this.key);
            }
        }
    }

    getHash() {
        return this.hashParam;
    }

    setHash(hash) {
        this.hashParam = hash = hash.toLowerCase();

        switch (hash) {
            case 'md5-96':
            case 'sha1-96':
            case 'sha256-96':
            case 'sha512-96':
                this.hash = hash.substr(0, hash.length - 3);
                this.l = 12;
                break;
            case 'md2':
            case 'md5':
                this.l = 16;
                break;
            case 'sha1':
                this.l = 20;
                break;
            case 'sha256':
                this.l = 32;
                break;
            case 'sha384':
                this.l = 48;
                break;
            case 'sha512':
                this.l = 64;
                break;
        }

        switch (hash) {
            case 'md2':
            case 'md5':
            case 'sha1':
            case 'sha224':
            case 'sha256':
                this.b = 64;
                break;
            default:
                this.b = 128;
                break;
        }

        if (global.CRYPT_HASH_MODE === Hash.MODE_HASH) {
            this.hash = hash;
            this.engine = Hash.MODE_HASH;
        } else {
            this.engine = Hash.MODE_INTERNAL;
            this.hashFunction = this[`_${hash}`];
        }

        this.ipad = Buffer.alloc(this.b, 0x36);
        this.opad = Buffer.alloc(this.b, 0x5C);
        this._computeKey();
    }

    hash(text) {
        let output;

        if (this.key) {
            const key = Buffer.alloc(this.b, this.computedKey || this.key);
            const ipad = Buffer.alloc(this.b, 0x36).map((b, i) => b ^ key[i]);
            const opad = Buffer.alloc(this.b, 0x5C).map((b, i) => b ^ key[i]);

            let innerHash = crypto.createHash(this.hash).update(Buffer.concat([ipad, Buffer.from(text)])).digest();
            output = crypto.createHash(this.hash).update(Buffer.concat([opad, innerHash])).digest();
        } else {
            if (this.engine === Hash.MODE_HASH) {
                output = crypto.createHash(this.hash).update(text).digest();
            } else {
                output = this.hashFunction(text);
            }
        }

        return output.slice(0, this.l);
    }

    getLength() {
        return this.l;
    }

    _md5(m) {
        return crypto.createHash('md5').update(m).digest();
    }

    _sha1(m) {
        return crypto.createHash('sha1').update(m).digest();
    }

    _sha256(m) {
        return crypto.createHash('sha256').update(m).digest();
    }

    _sha384(m) {
        return crypto.createHash('sha384').update(m).digest();
    }

    _sha512(m) {
        return crypto.createHash('sha512').update(m).digest();
    }
}

class BigIntegerMath {
    static add(a, b) {
        return bigInt(a).add(b);
    }

    static subtract(a, b) {
        return bigInt(a).subtract(b);
    }

    static multiply(a, b) {
        return bigInt(a).multiply(b);
    }

    static divide(a, b) {
        return bigInt(a).divide(b);
    }

    static mod(a, b) {
        return bigInt(a).mod(b);
    }

    static pow(a, b) {
        return bigInt(a).pow(b);
    }

    static gcd(a, b) {
        return bigInt(a).gcd(b);
    }

    static isPrime(a) {
        return bigInt(a).isPrime();
    }
}

// Example usage for Hash:
const hash = new Hash('sha256');
hash.setKey('my-secret-key');
console.log(hash.hash('my-text-to-hash').toString('hex'));

// Example usage for BigIntegerMath:
const a = '123456789012345678901234567890';
const b = '987654321098765432109876543210';

console.log('Addition: ', BigIntegerMath.add(a, b).toString());
console.log('Multiplication: ', BigIntegerMath.multiply(a, b).toString());
