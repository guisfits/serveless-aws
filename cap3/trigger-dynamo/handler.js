const { required } = require('@hapi/joi');

module.exports = {
  heroesInsert: require('./src/heroes-insert'),
  heroesTrigger: require('./src/heroes.trigger')
}
