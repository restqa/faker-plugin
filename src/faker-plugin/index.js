const faker = require('faker')
const RestQAPlugin = require('@restqa/plugins')
const GivenSteps = require('./steps/1-given')

const fakerPlugin = new RestQAPlugin()
const config = fakerPlugin.getConfig()
config.locale = config.locale || 'en'
config.prefix = config.prefix || 'faker'

GivenSteps
  .reduce((instance, step) => {
    return instance.addGivenStep.apply(this, step)
  }, fakerPlugin)
  .addState('results', [])
  .addState('setLocale', function (locale) {
    if (Object.keys(faker.locales).includes(locale) === false) {
      throw new Error(`The locale "${locale}" is not available please use the list from: https://github.com/Marak/faker.js#localization`)
    }
    faker.locale = locale
  })
  .addBeforeHook(function () {
    faker.locale = config.locale
    this.data.addProcessor(config.prefix, (property) => {
      try {
        const value = faker.fake(`{{${property}}}`)
        this.faker.results.push({
          property,
          value
        })
        return value
      } catch (err) {
        throw new Error(`The property "${err.message.split(' ').pop()}" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods`)
      }
    })
  })
  .addAfterHook(function () {
    const { results } = this.faker
    if (results.length === 0) return
    const msg = results.reduce((res, item) => {
      return `${res}\n  - ${item.property}: ${item.value}`
    }, `During the scenario faker has generated ${results.length} values for you`)
    this.attach(msg)
  })

module.exports = fakerPlugin
