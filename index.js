const JtiValidator = require('./JtiValidator');
const TokenVerifier = require('./TokenVerifier');

module.exports = {
    init: async (jwks, host = null, port = null, tls = false) => {
        const JtiValidator = require('./JtiValidator');
        return new Promise((resolve, reject) => {
            try {
                if (host) {
                    const jtiValidator = new JtiValidator(host, port, tls);
                    jtiValidator.client.on("ready", (err) => {
                            if(err)
                                reject(err);
                            else
                                resolve(new TokenVerifier(JSON.parse(jwks), jtiValidator))
                        });
                } else {
                    resolve(new TokenVerifier(JSON.parse(jwks)))
                }
            } catch (err) {
                reject(err);
            }
        })
    },
    Errors: require("./Errors")
}