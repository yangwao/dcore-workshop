module.exports = {
"decentd": {
  // local
  "host": "0.0.0.0",
  "port": "18093",
  "account": "public-account-10",
  "password": "xyz"
  // dev
  // "host": "172.99.1.12",
  // "port": "8093",
  // "account": "public-account-10",
  // "password": "xyz"
},
"pino": {
  "safe": true,
  "name": "ts",
  "timestamp": true,
  "prettyPrint": true,
  "serializers": {
    "req": "pino.stdSerializers.req",
    "res": "pino.stdSerializers.res"
  }
},
}
