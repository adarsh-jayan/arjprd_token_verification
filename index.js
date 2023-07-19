/**
 * options: 
 *  - jwks: jwks json
 *  - options: jwt library options
 */

module.exports = {
    init: async (options, host = null, port = null, tls = false) => {
        const JtiValidator = require('./JtiValidator');
        const TokenVerifier = require('./TokenVerifier');
        return new Promise((resolve, reject) => {
            try {
                if (host) {
                    const jtiValidator = new JtiValidator(host, port, tls);
                    jtiValidator.client.on("ready", (err) => {
                            if(err)
                                reject(err);
                            else
                                resolve(new TokenVerifier(options, jtiValidator))
                        });
                } else {
                    resolve(new TokenVerifier(options))
                }
            } catch (err) {
                reject(err);
            }
        })
    },
    Errors: require("./Errors")
}