class JtiValidator {
    constructor(host, port, tls=false) {
        const Redis = require("ioredis");
        
        console.log(host, port)
        this.client = new Redis.Cluster([
            {
              port: port,
              host: host
            }  
        ], 
        {
            dnsLookup: (address, callback) => callback(null, address),
            redisOptions: {
                tls: tls
            }
        });
    }

    isReady() {
        if( this.client.status === "ready" ) {
            return true;
        }
        return false;
    }

    async isValidJti(jti) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.client.get(jti);
                if(data) {
                    resolve(true);
                }
                resolve(false);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = JtiValidator;