const CWD = process.cwd()
const config = require(CWD + '/config')
const r2 = require('r2')
const d = {
  ...config.decentd,
  uri: `http://${config.decentd.host}:${config.decentd.port}/rpc`
}

l.info(`dcore wallet at ${d.uri}`)

let dOpts = {
  uri: d.uri,
  body: {
    jsonrpc: '2.0',
    params: [],
    id: 1
  }
}

const getInfo = async () => {
  dOpts.body.method = 'info'

  return r2.post(dOpts.uri, {
    json: dOpts.body
  }).json
}

const importKey = async (params) => {
  dOpts.body.method = 'import_key'
  dOpts.body.params = params.split(',')

  return r2.post(dOpts.uri, {
    json: dOpts.body
  }).json
}

const setPassword = async () => {
  dOpts.body.method = 'set_password'
  dOpts.body.params = [d.password]

  return r2.post(dOpts.uri, {
    json: dOpts.body
  }).json
}

const unlock = async () => {
  dOpts.body.method = 'unlock'
  dOpts.body.params = [d.password]

  return r2.post(dOpts.uri, {
    json: dOpts.body
  }).json
}

const isLocked = async () => {
  dOpts.body.method = 'is_locked'

  return r2.post(dOpts.uri, {
    json: dOpts.body
  }).json
}

const isNew = async () => {
  dOpts.body.method = 'is_new'

  return r2.post(dOpts.uri, {
    json: dOpts.body
  }).json
}

const getAccount = async (account) => {
  try {
    dOpts.body.method = 'get_account'
    dOpts.body.params = [account]
    const acc = await r2.post(dOpts.uri, {
      json: dOpts.body
    }).json

    return acc
  } catch (err) {
    l.error(`getAccount: ${err}`)
  }
}

const doesAccExist = async (account) => {
  const checkExistence = await getAccount(account)
  // l.info({checkExistence})
  if (checkExistence.error && checkExistence.error.code === 1) {
    return 0
  }
  return 1
}

const getBalance = async (account) => {
  dOpts.body.method = 'list_account_balances'
  dOpts.body.params = [account]
  const balance = await r2.post(dOpts.uri, {
    json: dOpts.body
  }).json

  if (!balance.result[0]) {
    return 0
  }

  return balance.result[0] && balance.result[0].amount
}

const listMyAccounts = async () => {
  dOpts.body.method = 'list_my_accounts'
  const accounts = await r2.post(dOpts.uri, {
    json: dOpts.body
  }).json

  // l.info({accounts})
  if (accounts.result.length === 0) {
    return 0
  }
  let allAccounts = []
  for (let a of accounts.result) {
    allAccounts.push(a.name)
  }

  return allAccounts
}

const listFirstAccount = async () => {
  const accounts = await listMyAccounts()
  const firstAccount = accounts[0]
  return firstAccount
}

const transferUIA = async (from, to, amount, memo) => {
  try {
    const exists = await doesAccExist(to)
    if (exists !== 1) {
      return exists
    }

    dOpts.body.method = 'transfer2'
    dOpts.body.params = [from, to, amount, config.UIA, memo, true]
    l.info(`${JSON.stringify(dOpts)}`)
    const transferOp = await r2.post(dOpts.uri, {
      json: dOpts.body
    }).json

    // l.info({transferOp})

    return transferOp
  } catch (err) {
    l.error(`transferUIA: ${err}`)
  }
}

const initialSetup = async (params) => {
  try {
    const is_new = await isNew()
    const accounts = await listMyAccounts()
    if (is_new.result === true &&
      accounts === 0) {
        const setPass = await setPassword()
        await unlock()
        l.info(setPass)
        const import_Key = await importKey(params)
        l.info({import_Key})

        return 'imported account'
      }

    if (is_new.result === false) {
      return 'already configured, remove wallet.json to start initialSetup'
    }

  } catch (err) {
    l.error(`initial setup ${err}`)
  }
}

const checkAvailability = async () => {
  try {
    const infoStatus = await getInfo()

    if (infoStatus.error) {
      l.error({infoStatus})
      throw new Error(infoStatus.error)
    }

    if (infoStatus.result &&
      infoStatus.result.head_block_num &&
      typeof infoStatus.result.head_block_num === 'number') {
      const islockedStatus = await isLocked()

      if (islockedStatus.result === true) {
        await unlock()
      }

      l.info(`decent connected & unlocked
        chain ${infoStatus.result.chain_id}
        account ${d.account}`)

      return 'ok'
    } else {
      l.error(`decentd cliwallet not ready`)
    }
  } catch (err) {
    l.error(`decentd cliwallet not ready`)
  }
}


module.exports = {
  doesAccExist,
  listFirstAccount,
  getBalance,
  getAccount,
  getInfo,
  transferUIA,
  isLocked,
  initialSetup,
  listMyAccounts,
  unlock,
  isNew,
  checkAvailability
}
