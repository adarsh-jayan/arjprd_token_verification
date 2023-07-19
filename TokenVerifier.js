

class TokenVerifier {

    /**
     * 
     * @param {Object} jwks 
     * @param {TokenRedisHandler} tokenRedisHandler 
     */
    constructor(options,tokenRedisHandler = null) {
        const jwkToPem = require('jwk-to-pem');
        this.jwt = require('jsonwebtoken');
        this.errors = require('./Errors');
        this.tokenRedisHandler = tokenRedisHandler;
        this.keys={};
        options.jwks.keys.forEach(jwk => {
            this.keys[jwk.kid] = jwkToPem(jwk);
        });
        this.options = options.options;
    }

    getKey(kid, callback) {
        if(this.keys[kid]) {
            callback(null, this.keys[kid]);
        } else {
            callback("key not found", null);
        }
    }

    /**
     * 
     * @param {String} token 
     * @returns 
     */
    async verify(token) {
        return new Promise(async (resolve, reject) => {
            try {
                this.jwt.verify(token, (header, callback) => {
                    this.getKey(header.kid, callback);
                }, this.options, async (err, decoded) => {
                    if(err) {
                        if(err.name === "TokenExpiredError") {
                            reject(this.errors.TokenExpired);
                        } else {
                            reject(this.errors.InvalidToken);
                        }
                    } else {
                        if(this.tokenRedisHandler && this.tokenRedisHandler.isReady()) {
                            let valid = await this.tokenRedisHandler.isValidJti(decoded.jti);
                            if(valid) {
                                resolve(decoded.sub);
                            } else {
                                reject(this.errors.InvalidToken);
                            }
                        } else {
                            resolve(decoded.sub);
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = TokenVerifier