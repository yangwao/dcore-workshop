// const dcorejs = require('dcorejs')
const app = require('express')()
const CWD = process.cwd()
const config = require(CWD + '/config')
// const multer = require('multer')

const pino = require('pino')
global.l = pino(config.pino)

const dcore = require('./lib/dcore')
// const {createHash} = require('crypto')

const wrap = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (e) {
      l.error(e)
    }
  }
}

app.get('/account/:accountName', wrap(async (req, res) => {
  const { accountName } = req.params
  const account = await dcore.getAccount(accountName)
  res.send({ account })
}))

app.post('/account', wrap(async (req, res) => {
  // const randomId = Math.floor(Math.random() * 1000000000)
  // const randomId = 1337
  // const brainKey = dcorejs.account().suggestBrainKey();
  // const ownerKey = dcorejs.Utils.generateKeys(brainKey)[0];
  // const activeKey = dcorejs.Utils.derivePrivateKey(brainKey, sequenceNumber + 1);
  // const memoKey = dcorejs.Utils.derivePrivateKey(brainKey, sequenceNumber + 2);

  // const name = `exalabs-decent-${randomId}`
  // const registrar = `` // I need this and privk
  // const registrarPrivK = ``


  // const [userPrivK, userPubK] = dcorejs.Utils.generateKeys(brainKey)

  const response = {
    // account
    // brainKey,
    // name,
    // registrar,
    // privK: userPrivK.stringKey,
    // pubK: userPubK.stringKey,
  }

  res.status(200).send(response)
}))

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(500).send({
    message: err.message,
    type: 'error',
    data: err
  });
}

app.use(errorHandler);

app.listen(3333)
