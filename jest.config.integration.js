// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config');
config.testRegex = 'itest\\.ts$'; //Overriding testRegex option
console.log('RUNNING INTEGRATION TESTS');

module.exports = config;
