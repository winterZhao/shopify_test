const mode = process.argv[2]
const modeConfig = require(`./${mode}.js`)

const config = {
    authKey: 'finance-auth',
    sessionKeyPrefix: 'share',
    mode
}

Object.assign(config, modeConfig)

module.exports = config