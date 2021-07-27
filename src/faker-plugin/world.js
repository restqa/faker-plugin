const { World } = require('@restqa/restqa-plugin-bootstrap')
const faker = require('faker')

class PluginWorld extends World {
  setup () {
    this.faker = {
      results: [],
      setLocale: function (locale) {
        if (Object.keys(faker.locales).includes(locale) === false) {
          throw new Error(`The locale "${locale}" is not available please use the list from: https://github.com/Marak/faker.js#localization`)
        }
        faker.locale = locale
      },
      get: function (property) {
        try {
          const value = faker.fake(`{{${property}}}`)
          this.results.push({
            property,
            value
          })
          return value
        } catch (err) {
          throw new Error(`The property "${err.message.split(' ').pop()}" is not valid. Available list at https://github.com/Marak/Faker.js#api-methods`)
        }
      },
      overrideDataGet: function (config, fn) {
        const $this = this
        return function (property) {
          if ((new RegExp(config.prefix)).test(property)) {
            const {
              startSymbol = '{{',
              endSymbol = '}}'
            } = config.data
            const variable = [startSymbol, endSymbol, `${config.prefix}.`].reduce((str, item) => str.replace(item, ''), property).trim()
            return $this.get(variable)
          }
          return fn.call(this, property)
        }
      }
    }
  }

  setConfig (config) {
    config.prefix = config.prefix || 'faker'
    super.setConfig(config)

    faker.locale = config.locale || 'en'

    this.data.get = this.faker.overrideDataGet(config, this.data.get)
  }
}

module.exports = PluginWorld
