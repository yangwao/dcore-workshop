const app = require('express')()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const CWD = process.cwd()
const config = require(CWD + '/config')
// const multer = require('multer')

const pino = require('pino')
global.l = pino(config.pino)

const dcore = require('./lib/dcore')
const publicAccount = require('./public-accounts').data
// const {createHash} = require('crypto')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

const wrap = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

app.post('/unlock', wrap(async (req, res) => {
  const response = await dcore.initialSetup(publicAccount)
  l.info({response})
  res.send({ status: 'success'})
}))

app.post('/account', wrap(async (req, res) => {
  const { newAccountAddress } = req.body

  const accountRegexp = /^(?=.{5,63}$)([a-z][a-z0-9-]+[a-z0-9])(\.[a-z][a-z0-9-]+[a-z0-9])*$/

  if (!newAccountAddress.match(accountRegexp)) {
    return res.send({ error: 'invalid_account_address' })
  }

  const brainkeyResult = (await dcore.suggestBrainKey()).result
  l.info({brainkeyResult})
  const newAcc = await dcore.registerAccount(
    newAccountAddress,
    brainkeyResult.pub_key,
    brainkeyResult.pub_key,
    'public-account-1'
    )

  if (!newAcc && !newAcc.operations.length) {
    return res.send({ error: "unknown_error" })
  }

  res.send({
    address: newAccountAddress,
    publicKey: brainkeyResult.pub_key,
    brainKey: brainkeyResult.brain_priv_key,
    privateKey: brainkeyResult.wif_priv_key
  })
}))

app.get('/account/:accountAddress', wrap(async (req, res) => {
  const { accountAddress } = req.params
  const account = await dcore.getAccount(accountAddress)
  res.send({ account })
}))

app.get('/messages/:accountAddress', wrap(async (req, res) => {
  const { accountAddress } = req.params
  const messages = await dcore.getMessagesByAddress(accountAddress)
  res.send({ messages })
}))

app.post('/message', wrap(async (req, res) => {
  const { accountAddresses, message } = req.body
  const messages = await dcore.sendMessage('public-account-1', accountAddresses, message)
  res.send({ messages })
}))

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  l.error(err)
  res.status(500).send({
    error: {
      message: err.message,
    }
  });
}

app.use(errorHandler);

app.listen(3333)
