const {
  After, AfterAll, Before, BeforeAll,
  Given, When, Then,
  defineParameterType,
  setWorldConstructor
} = require('cucumber')

const FakerPlugin = require('../src/faker-plugin')

const config = {
  name: 'local',
  data: {
    startSymbol: '{{',
    endSymbol: '}}'
  },
  locale: 'fr',
  prefix: 'faker'
}

Then('my fake value is accessible through {string}', val => {})
Then('my fake value is accessible through {data}', val => {})

const instance = new FakerPlugin(config)

instance.setParameterType(defineParameterType)
instance.setSteps({ Given, When, Then })
instance.setHooks({ Before, BeforeAll, After, AfterAll })

setWorldConstructor(instance.getWorld())
