const crypto = require('crypto');
const os = require('os');
const session = require('express-session');

class Random {
    /**
     * Generate a random string.
     * 
     * @param {number} length
     * @return {Buffer}
     */
    static string(length) {
        if (!length) {
            return '';
        }

        // Node.js equivalent of PHP's random_bytes
        try {
            return crypto.randomBytes(length);
        } catch (e) {
            // If an error occurs (although unlikely), we handle it gracefully
        }

        // Platform-specific logic
        if (os.platform().startsWith('win')) {
            if (crypto.getCiphers().includes('aes-256-ctr')) {
                return crypto.randomBytes(length);
            }
        } else {
            if (crypto.getCiphers().includes('aes-256-ctr')) {
                return crypto.randomBytes(length);
            }

            // Fallback to /dev/urandom for Unix-based systems
            try {
                const urandom = require('fs').readFileSync('/dev/urandom', { encoding: 'binary', length });
                if (urandom.length === length) {
                    return urandom;
                }
            } catch (e) {
                // Handle error gracefully
            }
        }

        // Fallback to pure-JavaScript CSPRNG if everything else fails
        return this.phpFallbackCSPRNG(length);
    }

    /**
     * Pure-JavaScript fallback for generating random strings.
     * 
     * @param {number} length
     * @return {string}
     */
    static phpFallbackCSPRNG(length) {
        let seed = this.createSeed();
        let key = crypto.createHash('sha1').update(seed + 'A').digest();
        let iv = crypto.createHash('sha1').update(seed + 'C').digest();
        let cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
        cipher.setAutoPadding(false);

        let result = '';
        while (result.length < length) {
            let i = cipher.update(Buffer.alloc(21, 0)); // equivalent to microtime()
            let r = cipher.update(i);
            result += r.toString('binary').slice(0, length - result.length);
        }
        return result;
    }

    /**
     * Generate a seed for the fallback CSPRNG.
     * 
     * @return {string}
     */
    static createSeed() {
        // Mimicking PHP's session-based seed generation
        let serverInfo = JSON.stringify({
            server: process.env,
            globals: global,
            session: session,
        });

        return crypto.createHash('sha1').update(serverInfo).digest('hex');
    }
}

// Example usage:
const randomString = Random.string(16);
console.log(randomString.toString('hex'));
