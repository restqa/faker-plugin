beforeEach(() => {
  jest.resetModules()
})

describe('#hooks', () => {
  describe('Before', () => {
    test('set the configuration', () => {
      const Hooks = require('./hooks')
      const World = require('./world')
      const $this = new World({})
      const Before = jest.fn(fn => {
        fn.call($this, { name: 'scenario name' })
      })

      const config = {
        foo: 'bar'
      }

      Hooks(config, { Before, After: jest.fn() })
      expect($this.getConfig()).toEqual(config)
    })

    test('set the configuration and run the data scenario parsing', () => {
      const Hooks = require('./hooks')
      const World = require('./world')
      const $this = new World({})
      const originalSetConfig = $this.setConfig

      jest.spyOn($this, 'setConfig').mockImplementation(obj => {
        originalSetConfig.call($this, obj)
      })

      const Before = jest.fn(async fn => {
        await fn.call($this, { name: 'scenario name' })
      })

      const config = {
        data: {}
      }

      Hooks(config, { Before, After: jest.fn() })
      expect($this.getConfig()).toEqual(config)
    })
  })

  describe('After', () => {
    test('Do not attach the faker message if no faker has been generated during the scenario', () => {
      const Hooks = require('./hooks')
      const World = require('./world')
      const attach = jest.fn()
      const $this = new World({ attach })
      const After = jest.fn(fn => {
        fn.call($this, { name: 'scenario name' })
      })

      const config = {}
      Hooks(config, { Before: jest.fn(), After })
      expect(attach).not.toHaveBeenCalled()
    })

    test('Attach the faker message if some faker has been generated during the scenario', () => {
      const Hooks = require('./hooks')
      const World = require('./world')
      const attach = jest.fn()
      const $this = new World({ attach })
      const spy = jest.spyOn($this.faker, 'get')
      const After = jest.fn(fn => {
        fn.call($this, { name: 'scenario name' })
      })

      const config = {
        locale: 'fr'
      }
      $this.faker.get('name.firstName')
      $this.faker.get('name.lastName')

      Hooks(config, { Before: () => $this.setConfig(config), After })
      const expectedMessage = `
During the scenario faker has generated 2 values for you
  - name.firstName: ${spy.mock.results[0].value}
  - name.lastName: ${spy.mock.results[1].value}
      `.trim()
      expect(attach).toHaveBeenCalled()
      expect(attach.mock.calls[0][0]).toEqual(expectedMessage)
    })
  })
})
